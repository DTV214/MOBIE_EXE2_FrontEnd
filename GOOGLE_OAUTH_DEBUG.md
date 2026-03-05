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



1. GET /api/daily-logs/date/{date}

// Headers (Required)
Authorization: Bearer {token}

// Path Parameter (Required)  
{date}  // LocalDate format: YYYY-MM-DD (ISO format)
        // VD: 2026-03-05

// No Query Parameters
// No Request Body

{
  "id": 123,
  "loggedDate": "2026-03-05",      // ← Ngày được query
  "stepAmount": 7500,              // Số bước trong ngày
  "totalCaloriesIn": 1850.0,       // Tổng calories ăn vào
  "totalCaloriesOut": 2156.25,     // Tổng calories tiêu thụ  
  "accountId": 456                 // ← ID user từ token
}

# Request
GET /api/daily-logs/date/2026-03-05
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBY2Nlc3M...

# Response 200
{
  "id": 123,
  "loggedDate": "2026-03-05", 
  "stepAmount": 7500,
  "totalCaloriesIn": 1850.0,
  "totalCaloriesOut": 2156.25,
  "accountId": 456
}
2. PATCH /api/daily-logs/{id}/steps

// Path Parameter (Required)
{id}        // Integer - ID của daily log

// Query Parameter (Required)
?steps={number}  // Integer - Số bước chân từ thiết bị
                 // VD: ?steps=8500

// Headers (Optional - endpoint is public)
Authorization: Bearer {token}  // Không bắt buộc

// No Request Body

{
  "id": 123,                       // ← ID daily log được update
  "loggedDate": "2026-03-05",
  "stepAmount": 8500,              // ← Số bước đã cập nhật
  "totalCaloriesIn": 1850.0,       // Calories ăn vào (không thay đổi)
  "totalCaloriesOut": 2198.75,     // ← Calories tiêu thụ (đã tính lại)
  "accountId": 456
}

# Request từ Fitbit/Apple Watch
PATCH /api/daily-logs/123/steps?steps=8500

# Response 200 
{
  "id": 123,
  "loggedDate": "2026-03-05",
  "stepAmount": 8500,              // ← Updated từ 7500 → 8500
  "totalCaloriesIn": 1850.0,
  "totalCaloriesOut": 2198.75,     // ← Recalculated từ 2156.25 → 2198.75
  "accountId": 456
}

cái đầu tiên truyền ngày hiện tại. Khi cái thứ 1 trả về id rồi lấy id đó gắn qua step của endpoint thứ 2