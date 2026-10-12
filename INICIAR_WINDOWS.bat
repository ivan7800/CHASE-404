@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>&1
if not errorlevel 1 (
  py -3 local_server.py
  goto :end
)
where python >nul 2>&1
if not errorlevel 1 (
  python local_server.py
  goto :end
)
echo ERROR: Python 3 no esta instalado o no esta en PATH.
echo Instala Python 3 desde python.org y vuelve a ejecutar este archivo.
pause
:end
endlocal
