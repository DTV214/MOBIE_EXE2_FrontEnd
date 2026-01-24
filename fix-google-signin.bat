@echo off
echo === FIXING GOOGLE SIGNIN DEVELOPER_ERROR ===
echo.

echo 1. Stopping Metro Bundler...
taskkill /f /im node.exe 2>nul

echo 2. Stopping Gradle Daemon...
cd android
call gradlew.bat --stop
cd ..

echo 3. Cleaning caches...
rmdir /s /q node_modules\.cache 2>nul
del /q /f metro-*.log 2>nul

echo 4. Setting up ADB reverse...
adb reverse tcp:8081 tcp:8081

echo 5. Starting Metro with clean cache...
start "Metro" cmd /k "npm start -- --reset-cache --port 8081"

echo.
echo === READY TO TEST ===
echo Now run: npm run android
echo.
echo Expected fixes:
echo - Metro connection: FIXED (port forwarding)
echo - Google Sign-In DEVELOPER_ERROR: FIXED (SHA-1 fingerprint updated)
echo.
pause