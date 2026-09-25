FROM python:3.12-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY server.py seed-products.json *.html *.css *.js ./
COPY media/ ./media/
COPY public/ ./public/
RUN mkdir -p /data && chown -R 10001:10001 /data /app
USER 10001

ENV DATA_DIR=/data PYTHONDONTWRITEBYTECODE=1
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:80/api/health', timeout=3)" || exit 1
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "80", "--proxy-headers", "--forwarded-allow-ips", "*"]
