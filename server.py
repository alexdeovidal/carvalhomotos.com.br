"""Site e catálogo administrável da Carvalho Motos."""

from __future__ import annotations

import hashlib
import hmac
import io
import json
import os
import re
import secrets
import sqlite3
import time
from contextlib import contextmanager
from pathlib import Path
from urllib.parse import urlparse

from fastapi import Depends, FastAPI, HTTPException, Request, Response
from fastapi.responses import FileResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from PIL import Image, ImageOps, UnidentifiedImageError
from pydantic import BaseModel, Field


ROOT = Path(__file__).resolve().parent
DATA_DIR = Path(os.getenv("DATA_DIR", ROOT / "data")).resolve()
UPLOAD_DIR = DATA_DIR / "uploads"
DB_PATH = DATA_DIR / "catalog.sqlite3"
SESSION_SECONDS = 12 * 60 * 60
MAX_UPLOAD_BYTES = 8 * 1024 * 1024
MAX_IMAGE_PIXELS = 24_000_000
CATEGORIES = {"urbanas", "trail", "custom", "eletricas", "bicicletas", "triciclos"}
STATUSES = {"inquiry", "available", "out_of_stock", "inactive"}
LOGIN_ATTEMPTS: dict[str, list[float]] = {}

app = FastAPI(title="Carvalho Motos", docs_url=None, redoc_url=None, openapi_url=None)


@contextmanager
def database():
    connection = sqlite3.connect(DB_PATH, timeout=10)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys=ON")
    connection.execute("PRAGMA busy_timeout=10000")
    try:
        yield connection
        connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()


def hash_password(password: str, salt: bytes | None = None) -> str:
    salt = salt or secrets.token_bytes(24)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 310_000)
    return f"pbkdf2_sha256$310000${salt.hex()}${digest.hex()}"


def verify_password(password: str, encoded: str) -> bool:
    try:
        scheme, rounds, salt, digest = encoded.split("$")
        if scheme != "pbkdf2_sha256":
            return False
        computed = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), bytes.fromhex(salt), int(rounds))
        return hmac.compare_digest(computed, bytes.fromhex(digest))
    except (ValueError, TypeError):
        return False


def init_database():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    with database() as db:
        db.execute("PRAGMA journal_mode=WAL")
        db.executescript("""
            CREATE TABLE IF NOT EXISTS products (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                type TEXT NOT NULL,
                badge TEXT NOT NULL DEFAULT '',
                description TEXT NOT NULL DEFAULT '',
                features TEXT NOT NULL DEFAULT '[]',
                images TEXT NOT NULL DEFAULT '[]',
                source TEXT NOT NULL DEFAULT '',
                source_label TEXT NOT NULL DEFAULT '',
                status TEXT NOT NULL DEFAULT 'inquiry',
                sort_order INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS admins (
                id INTEGER PRIMARY KEY,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS sessions (
                token_hash TEXT PRIMARY KEY,
                admin_id INTEGER NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
                csrf_token TEXT NOT NULL,
                expires_at INTEGER NOT NULL
            );
            CREATE TABLE IF NOT EXISTS metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL);
        """)
        admin_count = db.execute("SELECT COUNT(*) FROM admins").fetchone()[0]
        if not admin_count:
            email = os.getenv("ADMIN_EMAIL", "").strip().lower()
            password = os.getenv("ADMIN_PASSWORD", "")
            if not email or len(password) < 12:
                raise RuntimeError("Configure ADMIN_EMAIL e ADMIN_PASSWORD (mínimo 12 caracteres) antes de iniciar.")
            db.execute("INSERT INTO admins(email, password_hash) VALUES (?, ?)", (email, hash_password(password)))
        seeded = db.execute("SELECT value FROM metadata WHERE key='products_seeded'").fetchone()
        if not seeded:
            products = json.loads((ROOT / "seed-products.json").read_text(encoding="utf-8"))
            for index, item in enumerate(products):
                db.execute("""INSERT OR IGNORE INTO products
                    (id, name, category, type, badge, description, features, images,
                     source, source_label, status, sort_order)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'inquiry', ?)""",
                    (item["id"], item["name"], item["category"], item["type"], item["badge"],
                     item["description"], json.dumps(item["features"], ensure_ascii=False),
                     json.dumps([item["image"]]), item["source"], item["sourceLabel"], index * 10))
            db.execute("INSERT INTO metadata(key,value) VALUES ('products_seeded','1')")
        db.execute("DELETE FROM sessions WHERE expires_at < ?", (int(time.time()),))


@app.on_event("startup")
def startup():
    init_database()


def product_dict(row: sqlite3.Row) -> dict:
    images = json.loads(row["images"])
    return {
        "id": row["id"], "name": row["name"], "category": row["category"],
        "type": row["type"], "badge": row["badge"], "description": row["description"],
        "features": json.loads(row["features"]), "images": images,
        "image": images[0] if images else "", "source": row["source"],
        "sourceLabel": row["source_label"], "status": row["status"],
        "sort_order": row["sort_order"],
    }


def no_store(payload, status_code: int = 200):
    return JSONResponse(payload, status_code=status_code, headers={"Cache-Control": "no-store"})


@app.get("/api/health")
def health():
    with database() as db:
        db.execute("SELECT 1").fetchone()
    return {"ok": True}


@app.get("/api/products")
def public_products():
    with database() as db:
        rows = db.execute("SELECT * FROM products WHERE status != 'inactive' ORDER BY sort_order, name").fetchall()
    return no_store([product_dict(row) for row in rows])


class LoginInput(BaseModel):
    email: str
    password: str


def require_admin(request: Request) -> dict:
    token = request.cookies.get("cm_admin", "")
    if not token:
        raise HTTPException(status_code=401, detail="Faça login para continuar.")
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    with database() as db:
        row = db.execute("""SELECT sessions.csrf_token, admins.email FROM sessions
            JOIN admins ON admins.id=sessions.admin_id
            WHERE sessions.token_hash=? AND sessions.expires_at>?""", (token_hash, int(time.time()))).fetchone()
    if not row:
        raise HTTPException(status_code=401, detail="Sessão expirada. Entre novamente.")
    return {"token_hash": token_hash, "csrf": row["csrf_token"], "email": row["email"]}


def require_write(request: Request, admin: dict = Depends(require_admin)) -> dict:
    origin = request.headers.get("origin")
    if origin and urlparse(origin).hostname != request.headers.get("host", "").split(":")[0]:
        raise HTTPException(status_code=403, detail="Origem não permitida.")
    if not hmac.compare_digest(request.headers.get("x-csrf-token", ""), admin["csrf"]):
        raise HTTPException(status_code=403, detail="Token de segurança inválido.")
    return admin


@app.post("/api/admin/login")
def login(data: LoginInput, request: Request, response: Response):
    ip = request.client.host if request.client else "unknown"
    now = time.time()
    recent = [attempt for attempt in LOGIN_ATTEMPTS.get(ip, []) if now - attempt < 900]
    if len(recent) >= 8:
        raise HTTPException(status_code=429, detail="Muitas tentativas. Aguarde 15 minutos.")
    with database() as db:
        row = db.execute("SELECT id, email, password_hash FROM admins WHERE email=?", (data.email.strip().lower(),)).fetchone()
        if not row or not verify_password(data.password, row["password_hash"]):
            LOGIN_ATTEMPTS[ip] = recent + [now]
            raise HTTPException(status_code=401, detail="E-mail ou senha inválidos.")
        LOGIN_ATTEMPTS.pop(ip, None)
        token = secrets.token_urlsafe(48)
        csrf = secrets.token_urlsafe(32)
        db.execute("INSERT INTO sessions(token_hash,admin_id,csrf_token,expires_at) VALUES(?,?,?,?)",
                   (hashlib.sha256(token.encode()).hexdigest(), row["id"], csrf, int(now) + SESSION_SECONDS))
    secure = request.url.scheme == "https" or request.headers.get("x-forwarded-proto", "").split(",")[0] == "https"
    response = no_store({"email": row["email"], "csrf": csrf})
    response.set_cookie("cm_admin", token, max_age=SESSION_SECONDS, httponly=True,
                        secure=secure, samesite="strict", path="/")
    return response


@app.get("/api/admin/session")
def session(admin: dict = Depends(require_admin)):
    return no_store({"email": admin["email"], "csrf": admin["csrf"]})


@app.post("/api/admin/logout")
def logout(admin: dict = Depends(require_write)):
    with database() as db:
        db.execute("DELETE FROM sessions WHERE token_hash=?", (admin["token_hash"],))
    response = no_store({"ok": True})
    response.delete_cookie("cm_admin", path="/")
    return response


class ProductInput(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    category: str
    type: str = Field(min_length=2, max_length=80)
    badge: str = Field(default="", max_length=50)
    description: str = Field(default="", max_length=2000)
    features: list[str] = Field(default_factory=list, max_length=12)
    images: list[str] = Field(min_length=1, max_length=8)
    source: str = Field(default="", max_length=500)
    sourceLabel: str = Field(default="Ver publicação", max_length=80)
    status: str = "inquiry"
    sort_order: int = Field(default=0, ge=0, le=100000)


def validate_product(item: ProductInput):
    if item.category not in CATEGORIES or item.status not in STATUSES:
        raise HTTPException(status_code=422, detail="Categoria ou situação inválida.")
    if any(len(feature.strip()) > 100 or not feature.strip() for feature in item.features):
        raise HTTPException(status_code=422, detail="Cada característica deve ter até 100 caracteres.")
    if any(not image.startswith(("/public/products/", "/uploads/")) or ".." in image for image in item.images):
        raise HTTPException(status_code=422, detail="Use somente imagens do catálogo ou enviadas pelo painel.")
    if item.source and not (item.source.startswith("https://") or item.source.startswith("/public/")):
        raise HTTPException(status_code=422, detail="A fonte deve usar HTTPS ou ser uma página local.")


def write_product(db: sqlite3.Connection, product_id: str, item: ProductInput, creating: bool):
    values = (item.name.strip(), item.category, item.type.strip(), item.badge.strip(),
              item.description.strip(), json.dumps([x.strip() for x in item.features], ensure_ascii=False),
              json.dumps(item.images), item.source.strip(), item.sourceLabel.strip(),
              item.status, item.sort_order)
    if creating:
        db.execute("""INSERT INTO products(id,name,category,type,badge,description,features,images,
            source,source_label,status,sort_order) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)""", (product_id, *values))
    else:
        db.execute("""UPDATE products SET name=?,category=?,type=?,badge=?,description=?,features=?,images=?,
            source=?,source_label=?,status=?,sort_order=?,updated_at=CURRENT_TIMESTAMP WHERE id=?""", (*values, product_id))


@app.get("/api/admin/products")
def admin_products(admin: dict = Depends(require_admin)):
    with database() as db:
        rows = db.execute("SELECT * FROM products ORDER BY sort_order,name").fetchall()
    return no_store([product_dict(row) for row in rows])


@app.post("/api/admin/products")
def create_product(item: ProductInput, admin: dict = Depends(require_write)):
    validate_product(item)
    slug = re.sub(r"[^a-z0-9]+", "-", item.name.lower().encode("ascii", "ignore").decode()).strip("-")[:40] or "produto"
    product_id = f"{slug}-{secrets.token_hex(3)}"
    with database() as db:
        write_product(db, product_id, item, True)
        row = db.execute("SELECT * FROM products WHERE id=?", (product_id,)).fetchone()
    return no_store(product_dict(row), 201)


@app.put("/api/admin/products/{product_id}")
def update_product(product_id: str, item: ProductInput, admin: dict = Depends(require_write)):
    validate_product(item)
    with database() as db:
        if not db.execute("SELECT 1 FROM products WHERE id=?", (product_id,)).fetchone():
            raise HTTPException(status_code=404, detail="Produto não encontrado.")
        write_product(db, product_id, item, False)
        row = db.execute("SELECT * FROM products WHERE id=?", (product_id,)).fetchone()
    return no_store(product_dict(row))


@app.delete("/api/admin/products/{product_id}")
def delete_product(product_id: str, admin: dict = Depends(require_write)):
    with database() as db:
        deleted = db.execute("DELETE FROM products WHERE id=?", (product_id,)).rowcount
    if not deleted:
        raise HTTPException(status_code=404, detail="Produto não encontrado.")
    return no_store({"ok": True})


@app.post("/api/admin/uploads")
async def upload_image(request: Request, admin: dict = Depends(require_write)):
    content_type = request.headers.get("content-type", "").split(";")[0].lower()
    if content_type not in {"image/jpeg", "image/png", "image/webp"}:
        raise HTTPException(status_code=415, detail="Envie JPG, PNG ou WebP.")
    if int(request.headers.get("content-length", "0") or 0) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Imagem acima de 8 MB.")
    chunks = []
    total = 0
    async for chunk in request.stream():
        total += len(chunk)
        if total > MAX_UPLOAD_BYTES:
            raise HTTPException(status_code=413, detail="Imagem acima de 8 MB.")
        chunks.append(chunk)
    body = b"".join(chunks)
    if not body or len(body) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Imagem vazia ou acima de 8 MB.")
    try:
        Image.MAX_IMAGE_PIXELS = MAX_IMAGE_PIXELS
        with Image.open(io.BytesIO(body)) as image:
            image.verify()
        with Image.open(io.BytesIO(body)) as image:
            image = ImageOps.exif_transpose(image)
            if image.width * image.height > MAX_IMAGE_PIXELS:
                raise ValueError("dimensões excessivas")
            image.thumbnail((2200, 2200))
            if image.mode not in {"RGB", "RGBA"}:
                image = image.convert("RGBA" if "A" in image.getbands() else "RGB")
            filename = f"{secrets.token_hex(16)}.webp"
            image.save(UPLOAD_DIR / filename, format="WEBP", quality=86, method=5)
    except (UnidentifiedImageError, OSError, ValueError, Image.DecompressionBombError):
        raise HTTPException(status_code=422, detail="Imagem inválida ou muito grande.")
    return no_store({"url": f"/uploads/{filename}"}, 201)


app.mount("/public", StaticFiles(directory=ROOT / "public"), name="public")


@app.get("/uploads/{filename}")
def uploaded_image(filename: str):
    if not re.fullmatch(r"[0-9a-f]{32}\.webp", filename):
        raise HTTPException(status_code=404)
    path = UPLOAD_DIR / filename
    if not path.is_file():
        raise HTTPException(status_code=404)
    return FileResponse(path, media_type="image/webp", headers={"Cache-Control": "public, max-age=604800"})


PAGES = {
    "": "index.html", "loja": "loja.html", "admin": "admin.html",
    "politica-de-privacidade": "politica-de-privacidade.html",
    "politica-de-cookies": "politica-de-cookies.html", "termos-de-uso": "termos-de-uso.html",
}
ASSETS = {"styles.css", "compliance.css", "shop.js", "consent.js", "admin.css", "admin.js"}


@app.get("/")
def home():
    return FileResponse(ROOT / "index.html", media_type="text/html")


@app.get("/{path:path}")
def static_page(path: str):
    if path in ASSETS:
        media = "text/javascript" if path.endswith(".js") else "text/css"
        return FileResponse(ROOT / path, media_type=media)
    if path.endswith(".html") and path[:-5] in PAGES:
        return RedirectResponse("/" + path[:-5], status_code=301)
    if path in PAGES:
        headers = {"Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow"} if path == "admin" else None
        return FileResponse(ROOT / PAGES[path], media_type="text/html", headers=headers)
    raise HTTPException(status_code=404)
