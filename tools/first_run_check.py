"""CHASE 404: prueba de distribución HTTP local sin abrir un navegador."""
import json
import mimetypes
import threading
from functools import partial
from http.server import ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import urlopen
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from local_server import Handler


def main():
    server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Handler, directory=str(ROOT)))
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    base = f'http://127.0.0.1:{server.server_port}'
    checks = [
        ('/', b'CHASE 404', 'text/html'),
        ('/index.html', b'CHASE 404', 'text/html'),
        ('/src/main.js', b'import ', 'javascript'),
        ('/styles/main.css', b'{', 'text/css'),
        ('/assets/models/blaze.glb', b'glTF', 'model/gltf-binary'),
        ('/assets/models/viper.glb', b'glTF', 'model/gltf-binary'),
    ]
    passed = 0
    try:
        for path, marker, mime in checks:
            with urlopen(base + path, timeout=5) as response:
                body = response.read()
                content_type = response.headers.get_content_type()
                assert response.status == 200, f'{path}: status {response.status}'
                assert marker in body[:65536], f'{path}: contenido inválido'
                # Algunos Python antiguos reconocen .glb como octet-stream.
                assert mime in content_type or (path.endswith('.glb') and content_type == 'application/octet-stream'), f'{path}: MIME {content_type}'
                print(f'OK {path} · {response.status} · {len(body)} bytes · {content_type}')
                passed += 1
        try:
            urlopen(base + '/__chase404_missing__.js', timeout=5)
        except HTTPError as error:
            assert error.code == 404, f'Ruta inexistente devolvió {error.code}'
            passed += 1
            print('OK recurso inexistente → HTTP 404')
        else:
            raise AssertionError('Ruta inexistente debería devolver 404')
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=5)
    print(f'PRIMER ARRANQUE HTTP: {passed}/{len(checks)+1} comprobaciones correctas')


if __name__ == '__main__':
    main()
