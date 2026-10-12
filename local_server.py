"""Static file server, bound only to the user's local machine."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import webbrowser
from threading import Timer

ROOT = Path(__file__).resolve().parent

class Handler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        print('[HTTP]', format % args)

def main():
    app = ThreadingHTTPServer(('127.0.0.1', 0), partial(Handler, directory=str(ROOT)))
    url = 'http://127.0.0.1:{}/'.format(app.server_address[1])
    print('CHASE 404:', url, '\nPulsa Ctrl+C para detener el servidor.')
    Timer(1, webbrowser.open, [url]).start()
    try:
        app.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        app.server_close()

if __name__ == '__main__':
    main()
