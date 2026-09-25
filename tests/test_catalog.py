import importlib
import io
import os
import tempfile
import unittest
from pathlib import Path

from fastapi.testclient import TestClient
from PIL import Image


class CatalogTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        os.environ['DATA_DIR'] = self.temp.name
        os.environ['ADMIN_EMAIL'] = 'admin@example.test'
        os.environ['ADMIN_PASSWORD'] = 'test-password-long-enough'
        import server
        self.server = importlib.reload(server)
        self.client = TestClient(self.server.app).__enter__()

    def tearDown(self):
        self.client.__exit__(None, None, None)
        self.temp.cleanup()

    def login(self):
        response = self.client.post('/api/admin/login', json={'email': 'admin@example.test', 'password': 'test-password-long-enough'})
        self.assertEqual(response.status_code, 200)
        return {'X-CSRF-Token': response.json()['csrf']}

    def test_seed_and_authorized_lifecycle(self):
        self.assertEqual(len(self.client.get('/api/products').json()), 24)
        self.assertEqual(self.client.get('/api/admin/products').status_code, 401)
        self.assertEqual(self.client.post('/api/admin/login', json={'email': 'admin@example.test', 'password': 'wrong'}).status_code, 401)
        headers = self.login()
        self.assertEqual(len(self.client.get('/api/admin/products').json()), 24)
        item = self.client.get('/api/admin/products').json()[0]
        self.assertEqual(item['status'], 'inquiry')
        self.assertEqual(self.client.put('/api/admin/products/' + item['id'], json={**item, 'status': 'out_of_stock'}).status_code, 403)
        response = self.client.put('/api/admin/products/' + item['id'], json={**item, 'status': 'out_of_stock'}, headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'out_of_stock')
        self.assertEqual(len(self.client.get('/api/products').json()), 24)
        response = self.client.put('/api/admin/products/' + item['id'], json={**item, 'status': 'inactive'}, headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(self.client.get('/api/products').json()), 23)
        created = self.client.post('/api/admin/products', json={**item, 'name': 'Modelo de teste', 'status': 'available'}, headers=headers)
        self.assertEqual(created.status_code, 201)
        self.assertEqual(created.json()['name'], 'Modelo de teste')
        self.assertEqual(self.client.delete('/api/admin/products/' + created.json()['id'], headers=headers).status_code, 200)
        self.assertEqual(len(self.client.get('/api/admin/products').json()), 24)
        self.server.init_database()
        self.assertEqual(len(self.client.get('/api/admin/products').json()), 24)
        os.environ['ADMIN_PASSWORD'] = 'another-long-test-password'
        self.server.init_database()
        self.assertEqual(self.client.get('/api/admin/session').status_code, 401)
        self.assertEqual(self.client.post('/api/admin/login', json={'email': 'admin@example.test', 'password': 'another-long-test-password'}).status_code, 200)

    def test_image_upload_and_static_routes(self):
        headers = self.login()
        image = Image.new('RGB', (12, 12), 'red')
        buffer = io.BytesIO()
        image.save(buffer, format='PNG')
        response = self.client.post('/api/admin/uploads', content=buffer.getvalue(), headers={**headers, 'Content-Type': 'image/png'})
        self.assertEqual(response.status_code, 201)
        url = response.json()['url']
        self.assertEqual(self.client.get(url).headers['content-type'], 'image/webp')
        self.assertTrue((Path(self.temp.name) / url.removeprefix('/')).exists())
        self.assertEqual(self.client.get('/admin').status_code, 200)
        self.assertEqual(self.client.get('/loja.html', follow_redirects=False).status_code, 301)
        self.assertEqual(self.client.get('/.env.local').status_code, 404)

    def test_tutorial_video_requires_admin_session_and_supports_seek(self):
        self.assertEqual(self.client.get('/api/admin/tutorial-video').status_code, 401)
        self.login()
        response = self.client.get('/api/admin/tutorial-video', headers={'Range': 'bytes=0-1023'})
        self.assertEqual(response.status_code, 206)
        self.assertEqual(response.headers['content-type'], 'video/mp4')
        self.assertEqual(len(response.content), 1024)


if __name__ == '__main__':
    unittest.main()
