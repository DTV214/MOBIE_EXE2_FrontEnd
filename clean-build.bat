@echo off
echo Cleaning Android build files...
cd android
if exist app\build rmdir /s /q app\build
if exist build rmdir /s /q build
if exist app\.cxx rmdir /s /q app\.cxx
if exist .gradle rmdir /s /q .gradle

echo Stopping Gradle daemon...
call gradlew.bat --stop

echo Going back to root directory...
cd ..

echo Clearing React Native cache...
npx react-native start --reset-cache --port 8081

echo Build script complete! Now run: npx react-native run-android
pause