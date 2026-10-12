#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"
if ! command -v python3 >/dev/null; then
  printf 'ERROR: necesita Python 3. Instala python3 con tu gestor de paquetes.\n' >&2
  exit 1
fi
python3 ./local_server.py
