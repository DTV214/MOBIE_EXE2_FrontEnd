# 🔧 HƯỚNG DẪN KHẮC PHỤC LỖI GOOGLE LOGIN TRÊN APK

## ✅ ĐÃ KIỂM TRA VÀ XÁC NHẬN ĐÚNG

### 1. SHA-1 Fingerprints
- ✅ **Debug keystore SHA-1:** `42:E6:DF:03:0F:92:9E:BB:00:29:13:57:26:A2:F2:48:4D:80:99:E1`
- ✅ **Release keystore SHA-1:** `2E:66:C9:CD:B0:9F:E2:83:CC:9D:58:CB:3F:16:97:B9:4E:21:57:1E`
- ✅ **Firebase OAuth clients:** Đã đăng ký cả 2 SHA-1 trên

### 2. Package Name
- ✅ **Package:** `com.healthapp` (khớp với Firebase)

### 3. Web Client ID
- ✅ **Web Client ID:** `572891748659-hciej81p3gt3kpf0v589od4vhqjalc9j.apps.googleusercontent.com`
- ✅ **Configured in:** `LoginScreen.tsx`

### 4. Network Permissions
- ✅ **INTERNET permission:** Đã có
- ✅ **Cleartext traffic:** Đã cho phép HTTP

---

## 🔍 NGUYÊN NHÂN PHỔ BIẾN VÀ CÁCH KHẮC PHỤC

### ❌ LỖI 1: OAuth Consent Screen ở chế độ Testing

**Triệu chứng:**
- APK mở Google Login popup nhưng báo lỗi không cho phép đăng nhập
- Hoặc báo "This app is not verified"

**Nguyên nhân:**
- App đang ở chế độ **Testing** trong Google Cloud Console
- Chỉ các email được thêm vào "Test users" mới được phép đăng nhập

**✅ Cách khắc phục:**

#### Option A: Thêm Test Users (Nhanh)
1. Vào [Google Cloud Console - OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent?project=healthapp-lanhcare-caacc)
2. Chọn project: **healthapp-lanhcare-caacc**
3. Click "EDIT APP"
4. Scroll xuống phần "Test users"
5. Click "ADD USERS"
6. Nhập email Google của người test (VD: `yourname@gmail.com`)
7. Click "SAVE"

#### Option B: Chuyển sang Production (Khuyến nghị)
1. Vào [OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent?project=healthapp-lanhcare-caacc)
2. Click "PUBLISH APP"
3. Xác nhận chuyển sang Production
4. ⚠️ Lưu ý: Google có thể yêu cầu verification form nếu app dùng sensitive scopes

---

### ❌ LỖI 2: Google Play Services không khả dụng

**Triệu chứng:**
- App crash khi click nút "Login with Google"
- LogCat hiển thị: `Google Play Services not available`

**Nguyên nhân:**
- Thiết bị không cài Google Play Services (VD: máy ảo AVD)
- Google Play Services đã cũ, cần cập nhật

**✅ Cách khắc phục:**

#### Trên thiết bị thật:
```bash
# Mở Google Play Store
# Tìm "Google Play Services"
# Click "Update" nếu có bản mới
```

#### Trên Android Emulator:
```bash
# Tạo AVD mới với Google Play image:
# - Chọn "Phone" hoặc "Tablet"
# - Chọn System Image có logo "Play Store" (không phải AOSP)
# - Ví dụ: Pixel 5 - Android 13 - API 33 - Google Play
```

---

### ❌ LỖI 3: Lỗi Code 10 - Cấu hình sai

**Triệu chứng:**
- LogCat hiển thị: `Error code: 10`
- Hoặc: `DEVELOPER_ERROR`

**Nguyên nhân:**
- SHA-1 fingerprint không khớp
- Package name sai
- Web Client ID sai

**✅ Cách khắc phục:**

#### 3.1. Kiểm tra SHA-1 của APK đang test:

**Nếu test Debug APK:**
```cmd
cd android
keytool -list -v -keystore app\debug.keystore -storepass android -keypass android
```

**Nếu test Release APK:**
```cmd
cd android
keytool -list -v -keystore app\healthapp-release-key.keystore -storepass 123456
```

#### 3.2. Kiểm tra SHA-1 trong Firebase:
1. Vào [Firebase Console](https://console.firebase.google.com/project/healthapp-lanhcare-caacc/settings/general)
2. Chọn app Android: `com.healthapp`
3. Scroll xuống phần "Your apps" → "SDK setup and configuration"
4. Kiểm tra các SHA-1 fingerprints đã đăng ký
5. Nếu thiếu, click "Add fingerprint" và paste SHA-1 từ bước 3.1

---

### ❌ LỖI 4: Không kết nối được Backend

**Triệu chứng:**
- Google Login thành công (có Google popup)
- Nhưng sau đó báo lỗi: "Network error" hoặc "Timeout"
- LogCat hiển thị: `failed to connect to /14.225.207.221:8080`

**Nguyên nhân:**
- Backend server không chạy hoặc không accessible từ device
- Firewall/WiFi block port 8080
- Device không cùng network với backend

**✅ Cách khắc phục:**

#### 4.1. Kiểm tra Backend đang chạy:
```bash
# Test từ máy tính
curl http://14.225.207.221:8080/api/health

# Hoặc mở browser:
http://14.225.207.221:8080
```

#### 4.2. Kiểm tra Device kết nối được backend:
- Device và backend phải cùng WiFi (hoặc backend phải có IP public)
- Thử ping backend từ device (dùng Terminal Emulator app)

#### 4.3. Kiểm tra Network Security Config:
File đã đúng: `android/app/src/main/res/xml/network_security_config.xml`
```xml
<domain-config cleartextTrafficPermitted="true">
    <domain includeSubdomains="false">14.225.207.221</domain>
</domain-config>
```

---

### ❌ LỖI 5: Lỗi Code 7 - Network Error

**Triệu chứng:**
- LogCat hiển thị: `Error code: 7`
- Hoặc: `NETWORK_ERROR`

**Nguyên nhân:**
- Device không có internet
- Firewall chặn kết nối tới Google servers
- DNS issue

**✅ Cách khắc phục:**
1. Kiểm tra WiFi/Mobile data của device
2. Thử mở Chrome trên device, truy cập google.com
3. Tắt VPN nếu đang bật
4. Restart device

---

## 📱 CÁCH TEST VÀ XEM LOG

### 1. Build và cài APK:

**Debug APK (khuyến nghị cho test):**
```cmd
cd android
.\gradlew.bat assembleDebug

# APK output:
# android\app\build\outputs\apk\debug\app-debug.apk
```

**Release APK:**
```cmd
cd android
.\gradlew.bat assembleRelease

# APK output:
# android\app\build\outputs\apk\release\app-release.apk
```

### 2. Cài APK lên device:
```cmd
adb install android\app\build\outputs\apk\debug\app-debug.apk

# Nếu đã cài trước đó:
adb install -r android\app\build\outputs\apk\debug\app-debug.apk
```

### 3. Xem LogCat real-time:
```cmd
# Filter chỉ log của app
adb logcat -s ReactNativeJS:* ReactNative:*

# Hoặc xem tất cả log
adb logcat | findstr "healthapp"
```

### 4. Các log quan trọng cần tìm:

**Login thành công sẽ thấy:**
```
✅ Google Play Services available
[DATA] PHẢN HỒI THÔ TỪ GOOGLE SDK (FULL)
[STEP 2.1] LẤY ID TOKEN TỪ GOOGLE THÀNH CÔNG
[STEP 3] GỌI USE CASE: TIẾN HÀNH XÁC THỰC VỚI BACKEND
[STEP 4] BACKEND TRẢ VỀ JWT THÀNH CÔNG
[FLOW] ĐĂNG NHẬP HOÀN TẤT
```

**Login thất bại sẽ thấy:**
```
❌ GOOGLE PLAY SERVICES ERROR
[ERROR] LỖI TẠI TẦNG STORE
Mã lỗi hệ thống (code): 10
```

---

## 🎯 CHECKLIST KIỂM TRA NHANH

Trước khi test APK, đảm bảo:

- [ ] Google Play Services đã cài/cập nhật trên device
- [ ] Device có kết nối internet ổn định
- [ ] OAuth Consent Screen đã publish hoặc có thêm test user
- [ ] Backend server đang chạy và accessible từ device
- [ ] Build đúng variant (debug/release) khớp với SHA-1 đã đăng ký
- [ ] Xóa app cũ trước khi cài APK mới: `adb uninstall com.healthapp`

---

## 🔗 LIÊN KẾT QUAN TRỌNG

- [Google Cloud Console - OAuth](https://console.cloud.google.com/apis/credentials?project=healthapp-lanhcare-caacc)
- [Firebase Console - App Settings](https://console.firebase.google.com/project/healthapp-lanhcare-caacc/settings/general)
- [Firebase Console - OAuth Clients](https://console.firebase.google.com/project/healthapp-lanhcare-caacc/authentication/providers)

---

## 📞 HỖ TRỢ

Nếu vẫn gặp lỗi sau khi thử các cách trên:
1. Gửi đầy đủ log từ `adb logcat`
2. Screenshot màn hình lỗi trên app
3. Cho biết build debug hay release APK
4. Cho biết test trên máy thật hay emulator

---

**Updated:** March 6, 2026
**Project:** HealthApp LanhCare
**Firebase Project ID:** healthapp-lanhcare-caacc
