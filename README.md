# Resim

Frontend trình chỉnh ảnh cũ và khung FastAPI để chia việc cho nhóm BTL Xử lý ảnh.

**Hiện tại:** hạ tầng tải/xem ảnh gốc và chỉnh cấu hình được làm thật. Thuật toán, AI và xuất ảnh đã xử lý **chưa được triển khai**. Các endpoint tương ứng trả HTTP `501 NOT_IMPLEMENTED`; ứng dụng không giả lập kết quả.

## Giao diện

Mở `/` là vào editor: vùng upload/ảnh bên trái, sidebar **Công cụ / AI tư vấn** bên phải. Upload và thay ảnh diễn ra trong cùng màn hình, không có landing page hay bước chuyển sang editor.

Frontend dùng **Next.js + TypeScript + Tailwind CSS**. Backend dùng **FastAPI + Pydantic**. Chưa cần tài khoản, database hoặc GPU để chạy khung này.

## Yêu cầu

- Node.js 22 và npm.
- Python 3.12.
- Hai terminal: một chạy backend, một chạy frontend.

Các lệnh bên dưới dùng PowerShell trên Windows. Thay đường dẫn thư mục nếu bạn đặt dự án ở nơi khác. Dùng `npm.cmd` để tránh vấn đề execution policy của `npm.ps1`.

## 1. Chạy backend

Mở terminal tại `CodeBTL/backend`:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt -r requirements-dev.txt
Copy-Item .env.example .env
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Chỉ cần tạo virtualenv, cài dependencies và copy env ở lần đầu; không ghi đè `.env` bạn đã sửa.

- Health: <http://127.0.0.1:8000/api/health>
- Tài liệu API: <http://127.0.0.1:8000/docs>
- Ảnh gốc được lưu cục bộ, mặc định trong `backend/.storage`; không đưa thư mục này lên git.
- Giới hạn mặc định: 10 MiB/file, 20 triệu pixel; ảnh tạm có TTL 24 giờ.

## 2. Chạy frontend

Mở terminal khác tại `CodeBTL/frontend`:

```powershell
npm.cmd ci
Copy-Item .env.example .env.local
npm.cmd run dev
```

Mở <http://localhost:3000>. Biến `NEXT_PUBLIC_API_BASE_URL` trong `.env.local` phải trỏ tới backend, mặc định `http://127.0.0.1:8000`. Thay biến public cần khởi động lại frontend; khi build production, giá trị được nhúng lúc build.

## 3. Cách kiểm tra khung hoạt động

1. Vào `/`: đã thấy editor và vùng chọn/kéo thả ảnh.
2. Chọn một JPG/PNG nhỏ: preview xuất hiện ngay, backend nhận ảnh và trả ID.
3. Bật một chức năng, chỉnh tham số: ảnh gốc vẫn giữ nguyên vì chưa xử lý.
4. Nhấn **Xử lý ảnh**: frontend gửi cấu hình thật, backend trả thông báo chưa triển khai.
5. Chuyển tab **AI tư vấn**, nhập yêu cầu: backend cũng trả thông báo chưa triển khai, không có lời tư vấn mẫu.
6. **Tải kết quả** và so sánh trước–sau chưa hoạt động vì chưa có ảnh kết quả thật.
7. Đổi ảnh ngay trong editor: không đổi URL; cấu hình/lịch sử/kết quả của ảnh cũ được xóa.

Undo hiện chỉ hoàn tác **cấu hình**, không hoàn tác phiên bản ảnh.

## 4. Kiểm thử

Trong `backend`:

```powershell
.\.venv\Scripts\python.exe -m pytest -q
```

Trong `frontend`:

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
```

## 5. Bàn giao cho thành viên làm thuật toán

Đọc [hợp đồng API](docs/api-contract.md) và [đặc tả backend](docs/backend-spec.md) trước. Các module ở `backend/app/algorithms/` chứa các hàm có annotations/docstrings và `NotImplementedError`.

Quy ước dự kiến: ảnh NumPy `uint8`, kênh BGR; không sửa trực tiếp ảnh đầu vào. Mask vết xước do backend tự tạo, không có công cụ tô mask trên giao diện.

Trình tự tích hợp về sau:
1. Triển khai module thuật toán và tests tương ứng, giữ interface/tham số đã thống nhất hoặc thảo luận thay đổi hợp đồng trước.
2. Hoàn thiện `pipeline.process_image(...)`, luôn bắt đầu từ bản gốc, chỉ chạy bước được bật theo thứ tự request.
3. Hoàn thiện lưu/đọc/tải ảnh kết quả và response thành công của `/api/process` trước khi mở so sánh/download trên frontend.
4. Tích hợp AI sau cùng: nhận ảnh, trả nhận xét và tham số có cấu trúc; kiểm tra qua cùng bộ validation với người dùng. Không thực thi mã do AI sinh ra.
5. Khi chọn mô hình tô màu/upscale, xác nhận lại tham số và giới hạn phần cứng; catalog hiện tại là thiết kế cho phần chưa triển khai, không phải cam kết năng lực mô hình.

## Tài liệu triển khai

- [Kế hoạch, phân công và checklist](docs/implementation-plan.md)
- [Đặc tả giao diện và state](docs/frontend-spec.md)
- [Hợp đồng endpoint và tham số](docs/api-contract.md)
- [Đặc tả backend và phần cần implement](docs/backend-spec.md)
- [Kết quả kiểm thử và kiểm tra giao diện](docs/verification.md)

Không dùng thư mục `CODE BTL` bên cạnh: mã nguồn của đợt triển khai này nằm trong **`CodeBTL`**.
