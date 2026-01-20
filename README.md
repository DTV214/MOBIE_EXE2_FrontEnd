Dưới đây là file `README.md` chuyên nghiệp dành cho Frontend Mobile App của bạn. Nó được thiết kế đồng bộ với phong cách của Backend, giải thích rõ ràng về Clean Architecture, các thư viện sử dụng (`twrnc`, `zustand`...) và cách vận hành dự án.

Bạn hãy tạo một file tên là **`README.md`** trong thư mục gốc `HealthApp` và dán nội dung này vào nhé.

-----

# 📱 LanhCare - Mobile Health App

Ứng dụng di động theo dõi sức khỏe và wellness, được xây dựng bằng **React Native** tuân thủ kiến trúc **Clean Architecture**.

[](https://reactnative.dev/)
[](https://www.typescriptlang.org/)
[](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

-----

## 🚀 ✨ START HERE - Bắt Đầu Nhanh\!

Mọi thứ bạn cần để chạy ứng dụng trên máy ảo (Emulator) hoặc thiết bị thật.

### 🛠️ Yêu cầu môi trường (Prerequisites)

  * **Node.js**: Phiên bản 18+ (Khuyên dùng LTS)
  * **JDK**: Java Development Kit 17 (Cho Android build)
  * **Android Studio**: Đã cài đặt SDK và Máy ảo (Emulator)
  * **CocoaPods**: (Chỉ dành cho MacOS/iOS)

### 🏃‍♂️ Khởi động trong 3 bước

1.  **Cài đặt thư viện (Dependencies):**

    ```bash
    npm install
    # Nếu dùng MacOS:
    # cd ios && pod install && cd ..
    ```

2.  **Khởi động Metro Bundler (Server Javascript):**

    ```bash
    npx react-native start --reset-cache
    ```

3.  **Chạy ứng dụng (Trên Terminal mới):**

      * **Android:**
        ```bash
        npx react-native run-android
        ```
      * **iOS:**
        ```bash
        npx react-native run-ios
        ```

-----

## 🏗️ Kiến Trúc & Cấu Trúc Source Code

Dự án áp dụng **Clean Architecture** để tách biệt giao diện (UI) khỏi nghiệp vụ (Logic) và dữ liệu (Data).

### 📂 Cấu Trúc Thư Mục (`src/`)

```
src/
├── 🟢 domain/              # LỚP NGHIỆP VỤ (Quan trọng nhất, không phụ thuộc Framework)
│   ├── entities/           # Định nghĩa các đối tượng (User, HealthRecord...)
│   ├── repositories/       # Interfaces (Hợp đồng) cho việc lấy dữ liệu
│   └── usecases/           # Logic nghiệp vụ thuần túy (GetUserProfile, SaveMeal...)
│
├── 🟡 data/                # LỚP DỮ LIỆU (Triển khai các Interfaces)
│   ├── apis/               # Cấu hình gọi API (Axios)
│   ├── models/             # DTOs (Data Transfer Objects) từ Server
│   └── repositories/       # Code thực thi gọi API hoặc Mock Data
│
├── 🔵 presentation/        # LỚP GIAO DIỆN (React Native code)
│   ├── components/         # Các UI nhỏ tái sử dụng (Button, Card...)
│   ├── screens/            # Các màn hình chính (Home, Profile, Dashboard...)
│   ├── navigation/         # Cấu hình điều hướng (Stack, Tab)
│   └── viewmodels/         # Quản lý State màn hình (Zustand Stores)
│
├── ⚫ di/                  # Dependency Injection (Nơi kết nối các lớp lại với nhau)
└── ⚪ utils/               # Các hàm tiện ích (Format date, Tailwind config...)
```

### 🔄 Luồng dữ liệu (Data Flow)

1.  **UI (Screen)** gọi **ViewModel (Store)**.
2.  **ViewModel** gọi **Use Case**.
3.  **Use Case** gọi **Repository Interface**.
4.  **Repository Impl** (Data Layer) lấy dữ liệu từ **API/Mock**.

-----

## 🛠️ Tech Stack (Công Nghệ Sử Dụng)

### Core

  * **Framework:** React Native (0.76+)
  * **Language:** TypeScript (Strict mode)

### UI & Styling (Giao diện)

  * **Styling:** `twrnc` (Tailwind CSS for React Native) - *Viết style class nhanh, không cần config Babel.*
  * **Icons:** `lucide-react-native` - *Bộ icon hiện đại, nét mảnh.*
  * **Gradient:** `react-native-linear-gradient` - *Hiệu ứng chuyển màu nút bấm/thẻ.*
  * **Charts:** `react-native-gifted-charts` - *Biểu đồ sức khỏe (Nhịp tim, Calo).*
  * **Toast:** `react-native-toast-message` - *Thông báo nổi.*

### State Management & Logic

  * **State:** `zustand` - *Quản lý trạng thái nhẹ nhàng, thay thế Redux.*
  * **Navigation:** `react-native-navigation` (Native Stack).
  * **Forms:** `react-hook-form` (Quản lý form đăng ký/đăng nhập).

### Architecture Pattern

  * **Clean Architecture** (Domain - Data - Presentation).
  * **Dependency Injection (DI)** thủ công.
  * **Repository Pattern**.

-----

## 🎯 Tính Năng & Màn Hình (Frontend)

✅ **Đã Hoàn Thành (UI & Mock Data)**

  * **Onboarding:** Giới thiệu ứng dụng.
  * **Dashboard:**
      * Hiển thị biểu đồ nhịp tim, giấc ngủ.
      * Thẻ trạng thái (Steps, Calories) với icon Lucide.
      * Gradient Buttons & Cards.
  * **Profile:** Xem thông tin cá nhân (Mock Data).

🚧 **Đang Phát Triển**

  * **Meal Tracking:** Chọn món ăn, tính Calo tự động.
  * **AI Chat:** Giao diện chat với bác sĩ ảo.
  * **Payment:** Màn hình chọn gói dịch vụ & thanh toán.
  * **Authentication:** Đăng nhập/Đăng ký (Kết nối API thật).

-----

## 🔧 Scripts Tiện Ích

| Lệnh (Command) | Mô tả |
| :--- | :--- |
| `npm start` | Khởi chạy Metro Bundler |
| `npm run android` | Build và chạy trên Android Emulator |
| `npm run ios` | Build và chạy trên iOS Simulator |
| `npm start -- --reset-cache` | **Quan trọng:** Xóa cache khi gặp lỗi lạ hoặc đổi thư viện |
| `cd android && ./gradlew clean` | Dọn dẹp file build Android (Fix lỗi build fail) |

-----

## ❓ Troubleshooting (Gỡ Lỗi Thường Gặp)

**1. Lỗi "No online devices found"**

  * *Nguyên nhân:* Máy ảo chưa bật hoặc bị treo.
  * *Khắc phục:* Mở Android Studio -\> Device Manager -\> Bấm nút Play ▶️ để bật máy ảo **trước khi** chạy lệnh `run-android`.

**2. Lỗi "Requested internal only, but not enough space"**

  * *Nguyên nhân:* Máy ảo hết bộ nhớ trong.
  * *Khắc phục:* Vào Device Manager -\> Edit -\> Show Advanced Settings -\> Tăng **Internal Storage** lên `8192 MB` (8GB).

**3. Màn hình trắng trơn sau khi build thành công**

  * *Nguyên nhân:* Metro Bundler chưa chạy hoặc chưa kết nối.
  * *Khắc phục:* Mở terminal chạy `npx react-native start`. Sau đó vào máy ảo nhấn phím `R` hai lần để reload.

**4. Lỗi Icon hoặc SVG không hiện (Crash app)**

  * *Nguyên nhân:* Chưa link native code của `react-native-svg`.
  * *Khắc phục:* Tắt Metro, chạy `cd android && ./gradlew clean`, sau đó chạy lại `npx react-native run-android`.

-----
src/
├── domain/
│   ├── entities/
│   │   └── Subscription.ts (Plan, PaymentMethod, Transaction, Subscription)
│   ├── repositories/
│   │   └── ISubscriptionRepository.ts
│   └── usecases/
│       ├── GetAllPlans.ts
│       ├── GetPlanById.ts
│       ├── GetPaymentMethods.ts
│       ├── ProcessPayment.ts
│       └── GetTransactionById.ts
├── data/
│   └── repositories/
│       └── MockSubscriptionRepository.ts (3 plans, payment methods)
└── presentation/
    └── screens/
        └── Subscription_Screen/
            ├── ChoosePlanScreen.tsx
            ├── PaymentMethodScreen.tsx
            ├── ConfirmPaymentScreen.tsx
            └── PaymentSuccessScreen.tsx

## 📞 Liên Hệ Dev Team

  * **Frontend Lead:** [Danh-Võ]
 

Happy Coding\! 🚀
