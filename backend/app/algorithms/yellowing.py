# FE: "Giảm ố vàng", tool_id=yellowing, algorithm=remove_yellow_cast; người 3.
# strength: 0..1, bước UI 0.05, mặc định 0.5; 0 giữ input, 1 dùng toàn bộ
# kết quả sửa màu, giá trị giữa là mức trộn của wrapper khi triển khai.
# Input/output dự kiến BGR uint8 cùng kích thước; không sửa input, hiện là stub.

"""Yellow-cast correction interface (intentionally unimplemented)."""

from __future__ import annotations

from app.algorithms.types import ImageArray, StrengthParams


def remove_yellow_cast(image: ImageArray, params: StrengthParams) -> ImageArray:
    """Correct a yellow cast in a future implementation.

    Args:
        image: BGR uint8 NumPy image array.
        params: Catalog ``strength`` blend value from 0 to 1.

    Returns:
        A corrected BGR uint8 array; color correction is not implemented here.
    """
    raise NotImplementedError("Yellow-cast correction is not implemented.")
