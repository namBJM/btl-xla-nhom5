"""Contrast algorithm interfaces (intentionally unimplemented)."""

from __future__ import annotations

from app.algorithms.types import ClaheParams, ImageArray


def enhance_clahe(image: ImageArray, params: ClaheParams) -> ImageArray:
    """Enhance local contrast with CLAHE in a future implementation.

    Args:
        image: BGR uint8 NumPy image array.
        params: ``clip_limit`` and square-grid tile count ``tile_grid_size``.

    Returns:
        A contrast-enhanced BGR uint8 array with unchanged dimensions.
    """
    raise NotImplementedError("CLAHE contrast enhancement is not implemented.")
