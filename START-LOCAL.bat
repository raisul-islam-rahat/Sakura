@echo off
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  py preview.py
  goto :end
)
where python >nul 2>nul
if %errorlevel%==0 (
  python preview.py
  goto :end
)
echo Python 3 is required for local preview. You can also upload the files to GitHub Pages.
pause
:end
