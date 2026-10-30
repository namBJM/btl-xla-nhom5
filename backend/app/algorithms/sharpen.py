# FE: "Làm sắc nét", tool_id=sharpen, algorithm=sharpen_unsharp; người 2.
# amount: 0..3, bước UI 0.05, mặc định 0.8; sigma: 0.1..5, bước 0.1, mặc định 1.
# Serializer FE đặt sau colorize và trước upscale, khác vị trí hiển thị trên sidebar.
# Input/output dự kiến BGR uint8 cùng kích thước; không sửa input, hiện là stub.

"""Sharpening algorithm interfaces (intentionally unimplemented)."""

from __future__ import annotations

from app.algorithms.types import ImageArray, UnsharpParams


def sharpen_unsharp(image: ImageArray, params: UnsharpParams) -> ImageArray:
    """Apply unsharp-mask sharpening in a future implementation.

    Args:
        image: BGR uint8 NumPy image array.
        params: Catalog ``amount`` and ``sigma`` values.

    Returns:
        A sharpened BGR uint8 array with unchanged dimensions.
    """
    raise NotImplementedError("Unsharp sharpening is not implemented.")
