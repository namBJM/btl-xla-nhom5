# Kết quả kiểm tra scaffold Resim

Đợt kiểm tra: 25/10/2026. Phạm vi là frontend và hạ tầng backend, không đánh giá chất lượng khôi phục ảnh.

## Kiểm tra tự động

Các lệnh được coordinator chạy lại sau khi các subagent bàn giao và sửa lỗi:

| Thư mục | Lệnh | Kết quả |
|---|---|---|
| frontend | `npm.cmd run lint` | Đạt |
| frontend | `npm.cmd run typecheck` | Đạt |
| frontend | `npm.cmd test` | 21 test đạt |
| frontend | `npm.cmd run build` | Đạt; có route `/` và icon cục bộ |
| backend | `.\.venv\Scripts\python.exe -m pytest -q` | 49 test đạt |

Backend có một deprecation warning từ tương tác Starlette TestClient/httpx, không làm test thất bại. Không cần đổi dependency để chạy bản khung hiện tại.

Kiểm tra HTTP thực với Uvicorn cũng xác minh health, catalog, upload/read nguyên byte, strict parameter validation, process/advise/download 501, ảnh không tồn tại 404 và CORS preflight. JPEG bị bỏ marker kết thúc trả 415; Swagger hiển thị input file multipart.

## Kiểm tra trên Chrome

- Desktop khoảng 1440 px: mở `/` vào thẳng editor, sidebar 360 px, ảnh không tràn sang sidebar.
- Mobile 390 × 844 px: canvas ở trên, công cụ ở dưới, không có horizontal overflow.
- Chọn ảnh và thay ảnh giữ nguyên URL `/`; local preview xuất hiện trong đúng vùng dropzone.
- File không phải ảnh và kéo thả hai file bị từ chối, giữ nguyên ảnh đang có.
- JPEG có tên `.png` vẫn được nhận theo nội dung, preview đúng và backend trả metadata JPEG.
- Bật cả tám nhóm gửi đúng tám bước theo thứ tự contract, với các tham số là số; backend trả 501 và UI không tạo result.
- Gamma nhận được hai lần ArrowRight liên tiếp, giá trị 1 → 1.05 → 1.1; focus vẫn ở thanh điều chỉnh.
- Reset đưa cấu hình về default/tắt chức năng; undo khôi phục cấu hình trước reset. Ảnh gốc vẫn không có CSS filter.
- Zoom hoạt động; vùng ảnh cắt phần vượt khung, không gây tràn trang.
- Yêu cầu AI gửi cấu hình thật; UI giữ prompt và hiển thị 501, không tạo nhận xét/đề xuất giả.
- Chưa có result thì tải kết quả và so sánh bị khóa.
- Mở lại editor trong browser context sạch: kết nối backend thành công, không có console warning/error trong trạng thái khởi tạo.

### Hai trường hợp bất đồng bộ được thử riêng

**Mất kết nối:** tạm chặn fetch tới backend trong browser QA (không sửa application). Editor vẫn hiện, không tạo catalog giả; chọn ảnh vẫn xem được local preview nhưng báo chưa upload. Khôi phục fetch, nhấn kết nối lại và tải lại thì request thật thành công.

**Upload đến muộn:** giữ lại response thật của lần upload A, upload B đến backend thật và để B hoàn tất, sau đó thả response A. UI vẫn hiển thị B, history/config của A được xóa; request process tiếp theo dùng đúng image_id của B. Các wrapper QA được gỡ và browser context thử nghiệm được đóng sau khi xác minh.

## Các lỗi đã sửa trong lượt tích hợp

1. CORS bao ngoài body-limit middleware để browser đọc được lỗi upload 413.
2. Upload có schema multipart trong OpenAPI để các thành viên thử được từ Swagger.
3. Xác thực ảnh giải mã đầy đủ sau khi kiểm tra pixel cap, chặn JPEG cắt cụt mà `verify()` bỏ sót; vẫn lưu byte gốc.
4. Kiểm tra định dạng frontend theo nội dung, không tin extension/MIME.
5. Control tham số có identity ổn định, không remount sau mỗi thay đổi; draft đồng bộ với slider, undo và reset.

## Phần chưa triển khai có chủ đích

Mọi thuật toán khôi phục, pipeline thực thi, AI và sinh/xuất result vẫn là stubs. Các chức năng này cần được thành viên phụ trách implement và kiểm thử riêng. Việc test xanh ở đợt này không đồng nghĩa ảnh đã được cải thiện chất lượng.
