@echo off
echo Starting Daily Checklist App Server...
echo.
echo The app will be available at: http://localhost:8000
echo.
echo To install on Android:
echo 1. Open http://localhost:8000 in Chrome on your Android device
echo 2. Look for the "Add to Home Screen" prompt
echo 3. Tap "Install" to install the app
echo.
echo Press Ctrl+C to stop the server
echo.
python server.py
pause 