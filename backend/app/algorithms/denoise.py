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
