"""Brightness algorithm interfaces (intentionally unimplemented)."""

from __future__ import annotations

from app.algorithms.types import GammaParams, ImageArray


def adjust_gamma(image: ImageArray, params: GammaParams) -> ImageArray:
    """Adjust brightness using the future ``out = in ** (1 / gamma)`` convention.

    Args:
        image: BGR uint8 NumPy image array.
        params: ``gamma`` from the catalog, strictly greater than zero.

    Returns:
        A brightness-adjusted BGR uint8 array with unchanged dimensions.
    """
    raise NotImplementedError("Gamma adjustment is not implemented.")
