# GOOGLE OAUTH CONFIGURATION ISSUE

## Current SHA-1 Fingerprint (Local):
```
5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
```

## Steps to fix DEVELOPER_ERROR (Code 10):

### 1. Update Google Console
1. Go to: https://console.cloud.google.com/
2. Select project: `healthapp-lanhcare`
3. Navigation: APIs & Services > Credentials
4. Edit OAuth 2.0 Client IDs
5. Under "SHA certificate fingerprints", add:
   ```
   5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
   ```

### 2. Alternative: Generate new google-services.json
1. Go to: https://console.firebase.google.com/
2. Select project: `healthapp-lanhcare`  
3. Project Settings > General > Your apps
4. Download new `google-services.json`
5. Replace in: `android/app/google-services.json`

### 3. Clean rebuild after changes
```cmd
cd android && gradlew.bat clean && cd ..
npm run android
```

## Current Config Files:
- **Package:** com.healthapp
- **Web Client ID:** 144144442191-4omafm2jo2s1h6fbmlh34rcg2v9e4f4m.apps.googleusercontent.com
- **Android Client ID:** 144144442191-klujpoesodiqkt1ab3sltpitg1qhe8dd.apps.googleusercontent.com

## Debug Info:
- Error Code: 10 (DEVELOPER_ERROR)
- Likely cause: SHA-1 mismatch in Google Console vs local keystore