# Điểm ghép 8 nhóm công cụ; hiện raise NotImplementedError, route chưa gọi hàm này.
# FE serializeSteps() gửi thứ tự: scratches -> denoise -> yellowing -> brightness
# -> contrast -> colorize -> sharpen -> upscale; chỉ gồm công cụ được bật.
# Khi triển khai: bắt đầu từ ảnh gốc BGR uint8, chạy theo request, không sửa ảnh gốc.
# Hàm trả mảng ảnh nội bộ; route/storage còn phải mã hóa, lưu và tạo ProcessResult.
# Chỉ hoàn thiện hàm này chưa đủ để mở so sánh hoặc tải kết quả trên FE.

"""Processing pipeline interface (intentionally unimplemented)."""

from __future__ import annotations

from collections.abc import Sequence

from app.algorithms.types import ImageArray, PipelineStep


def process_image(original: ImageArray, steps: Sequence[PipelineStep]) -> ImageArray:
    """Execute the validated steps in request order in a future implementation.

    Args:
        original: Original BGR uint8 NumPy image array; callers retain the original.
        steps: Validated algorithm identifiers and numeric parameter dictionaries.

    Returns:
        A newly processed BGR uint8 array. No step is executed by this scaffold.
    """
    raise NotImplementedError("The image processing pipeline is not implemented.")
