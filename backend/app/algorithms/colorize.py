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
