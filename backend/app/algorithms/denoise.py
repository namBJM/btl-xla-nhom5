# FE: "Khử nhiễu", tool_id=denoise; người 1 phụ trách theo đề xuất phân công.
# Median: algorithm=denoise_median; kernel_size chọn 3/5/7 (mặc định 3).
# Bilateral: algorithm=denoise_bilateral; diameter chọn 5/7/9 (mặc định 5),
# sigma_color và sigma_space trong 1..150 (mặc định 50).
# Hai phương pháp chung một nhóm; FE chỉ gửi phương pháp đang chọn khi nhóm bật.
# Input/output dự kiến BGR uint8 cùng kích thước, không sửa input; hiện là stub.

"""Denoising algorithm interfaces (intentionally unimplemented)."""

from __future__ import annotations

from app.algorithms.types import BilateralParams, ImageArray, MedianParams


def denoise_median(image: ImageArray, params: MedianParams) -> ImageArray:
    """Apply median denoising in the future.

    Args:
        image: BGR uint8 NumPy image array.
        params: ``kernel_size`` is one of 3, 5, or 7.

    Returns:
        A denoised BGR uint8 array with the same dimensions.
    """
    raise NotImplementedError("Median denoising is not implemented.")


def denoise_bilateral(image: ImageArray, params: BilateralParams) -> ImageArray:
    """Apply edge-preserving bilateral denoising in the future.

    Args:
        image: BGR uint8 NumPy image array.
        params: ``diameter``, ``sigma_color``, and ``sigma_space`` from the catalog.

    Returns:
        A denoised BGR uint8 array with the same dimensions.
    """
    raise NotImplementedError("Bilateral denoising is not implemented.")
