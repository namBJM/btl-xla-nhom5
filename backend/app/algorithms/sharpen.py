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
