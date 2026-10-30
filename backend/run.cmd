@echo off
rem Start FastAPI on port 8000; run npm.cmd run dev separately in frontend.
rem Uses the backend virtualenv directly; activation is not required.
setlocal
cd /d "%~dp0"
".venv\Scripts\python.exe" -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
