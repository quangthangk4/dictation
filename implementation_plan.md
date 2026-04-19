# Book & Test Hierarchy Architecture

Chúng ta sẽ tái cấu trúc lại cơ sở dữ liệu và hệ thống định tuyến (routing) để nhóm các bài luyện tập theo cấu trúc: `Tên Sách (VD: ETS 2026)` -> `Tên Bài thi (VD: Test 1)` -> `Phần Nghe (Dictation)`.

> [!IMPORTANT]
> - Đây là lần thay đổi lớn liên quan tới **Database Schema** (Cơ sở dữ liệu).
> - Các bài Dictation cũ của bạn trước kia vẫn sẽ được giữ lại, hệ thống sẽ để chúng ở tình trạng "Uncategorized" (Chưa phân loại) hoặc nếu cần tôi sẽ gán tạm chúng vào một Sách & Test mặc định.
> - Cần chạy lại lệnh migration (`npx prisma db push`) để cập nhật Schema sau khi chốt cấu trúc.

## User Review Required

Bạn có đồng ý với cấu trúc cấp bậc này không?
- Cấp 1: **Book** (Ví dụ: ETS 2026, Hacker IELTS)
- Cấp 2: **Test** (Ví dụ: Test 1, Test 2)
- Cấp 3: **Dictation** (Các bài nghe hiện tại như Part 1, Part 2...)

## Proposed Changes

---

### Database Schema (Prisma)

#### [MODIFY] [schema.prisma](file:///c:/Users/thang/OneDrive/Desktop/nghe_chep_chinh_ta/prisma/schema.prisma)
Thêm 2 bảng mới `Book` và `Test`, đồng thời liên kết bảng `Dictation` về bảng `Test`.
```prisma
model Book {
  id        String   @id @default(uuid())
  title     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  tests     Test[]
}

model Test {
  id        String   @id @default(uuid())
  title     String
  bookId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  book      Book     @relation(fields: [bookId], references: [id], onDelete: Cascade)
  dictations Dictation[]
}

// Thêm field vào mô hình Dictation hiện tại
model Dictation {
  ...
  testId    String? 
  test      Test?   @relation(fields: [testId], references: [id], onDelete: Cascade)
  ...
}
```

---

### Page Layouts & Routing

#### [MODIFY] [page.tsx](file:///c:/Users/thang/OneDrive/Desktop/nghe_chep_chinh_ta/app/page.tsx)
Trang chủ sẽ không còn liệt kê toàn bộ Dictation nữa, mà sẽ hiển thị danh sách các **Sách (Books)**. Bao gồm một nút hoặc ô điền nhanh để tạo Sách mới.

#### [NEW] [book/[id]/page.tsx](file:///c:/Users/thang/OneDrive/Desktop/nghe_chep_chinh_ta/app/book/[id]/page.tsx)
Trang quản lý chi tiết Sách. Màn hình này liệt kê tất cả các **Test** ở trong quyển Sách ứng với ID. Bao gồm thao tác "Thêm Test (Test 1, Test 2)".

#### [NEW] [test/[id]/page.tsx](file:///c:/Users/thang/OneDrive/Desktop/nghe_chep_chinh_ta/app/test/[id]/page.tsx)
Trang quản lý Test. Hiển thị danh sách các **Dictation** (bài tập) riêng biệt của Test này. Sẽ có nút "+ Add Dictation" để tải thêm văn bản gắn liền với bài Test này.

#### [MODIFY] [upload/page.tsx](file:///c:/Users/thang/OneDrive/Desktop/nghe_chep_chinh_ta/app/upload/page.tsx)
Nhận tham số `?testId=abc` từ URL để gán bài Dictation này đúng vào `Test` mà bạn vừa chọn.

#### [MODIFY] [dictation/[id]/page.tsx](file:///c:/Users/thang/OneDrive/Desktop/nghe_chep_chinh_ta/app/dictation/[id]/page.tsx)
Cập nhật thanh điều hướng (Breadcrumb) ở đầu trang để bạn dễ dàng nhìn thấy cấu trúc: `ETS 2026 > Test 1 > Part 4` và ấn Back linh hoạt.

---

### Server Actions

#### [MODIFY] [app/actions/dictation.ts](file:///c:/Users/thang/OneDrive/Desktop/nghe_chep_chinh_ta/app/actions/dictation.ts)
Thêm các hàm mới để tương tác với Database:
- `createBook(title: string)`
- `getBooks()`
- `createTest(title: string, bookId: string)`
- `getTestsByBook(bookId: string)`
- Cập nhật hàm `createDictation(data: FormData)` bổ sung luồng lấy testId để gán vào mục.

## Open Questions

1. Các bài Dictation cũ của bạn hiện tại không có Test ID. Tạm thời chúng sẽ lưu trong cơ sở dữ liệu như là một bài Dictation mồ côi (vẫn cho phép truy cập qua link). Hay bạn muốn tôi nhét hết chúng vào một quyển sách rỗng tên là "Uncategorized"?
2. Có cần phải code thêm tính năng XÓA (Delete) các quyển Sách và Test này không?

## Verification Plan

### Manual Verification
- Nạp Prisma DB Schema tự động và kiểm tra không bị hỏng DB cũ.
- Điều hướng ra trang Home, thử tạo 1 sách: "ETS 2026".
- Vào trong "ETS 2026", tiến hành bấm tạo "Test 1".
- Truy cập vào Test 1, ấn Upload để chép văn bản mới.
- Sau khi Upload, kiểm tra xem bài mới có hiển thị đúng trong Test 1 hay không.
