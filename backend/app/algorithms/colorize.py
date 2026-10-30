# FE: "Tô màu ảnh", tool_id=colorize, algorithm=colorize_image; người 3.
# strength: 0..1, bước UI 0.05, mặc định 1; là mức trộn wrapper,
# không phải tham số nội bộ của mô hình: 0 giữ input, 1 dùng kết quả tô màu.
# Khi tích hợp mô hình phải chuyển RGB/BGR đúng tại biên; trả BGR uint8.
# Model chưa được tích hợp; FE chưa có ảnh tô màu thật để hiển thị.

"""Colorization interface (intentionally unimplemented)."""

from __future__ import annotations

from app.algorithms.types import ImageArray, StrengthParams


def colorize_image(image: ImageArray, params: StrengthParams) -> ImageArray:
    """Colorize an input image in a future implementation.

    Args:
        image: BGR uint8 NumPy image array.
        params: Catalog ``strength`` blend value from 0 to 1.

    Returns:
        A colorized BGR uint8 array; no model or fallback is provided by this stub.
    """
    raise NotImplementedError("Image colorization is not implemented.")
