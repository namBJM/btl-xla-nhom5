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
