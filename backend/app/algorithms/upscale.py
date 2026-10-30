# FE: "Nâng độ phân giải", tool_id=upscale, algorithm=upscale_image; người 4.
# scale là integer 2 hoặc 4, mặc định 2; ToolsPanel hiển thị 2x/4x.
# Đây phải là bước cuối request; output dự kiến width/height nhân scale.
# Metadata ProcessResult phải phản ánh kích thước thật để FE hiện/so sánh đúng.
# Chưa có mô hình hay nội suy trong stub, không được báo thành công bằng ảnh gốc.

"""Image-upscaling interface (intentionally unimplemented)."""

from __future__ import annotations

from app.algorithms.types import ImageArray, UpscaleParams


def upscale_image(image: ImageArray, params: UpscaleParams) -> ImageArray:
    """Upscale an image by a catalog-supported factor in a future implementation.

    Args:
        image: BGR uint8 NumPy image array.
        params: ``scale`` is 2 or 4; the pipeline must run this as its final step.

    Returns:
        An upscaled BGR uint8 array; interpolation and AI models are not implemented.
    """
    raise NotImplementedError("Image upscaling is not implemented.")
