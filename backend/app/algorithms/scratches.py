"""Scratch detection and reduction interfaces (intentionally unimplemented)."""

from __future__ import annotations

from app.algorithms.types import ImageArray, MaskArray, ScratchParams


def detect_scratches(image: ImageArray, params: ScratchParams) -> MaskArray:
    """Return a future uint8 scratch mask with the same image dimensions.

    Args:
        image: BGR uint8 NumPy image array.
        params: Catalog sensitivity and inpaint-radius configuration.

    Returns:
        A single-channel uint8 mask; the mask-generation algorithm is not implemented.
    """
    raise NotImplementedError("Scratch detection is not implemented.")


def reduce_scratches(image: ImageArray, params: ScratchParams) -> ImageArray:
    """Reduce scratches using an internally generated mask in the future.

    Args:
        image: BGR uint8 NumPy image array.
        params: Catalog sensitivity and inpaint-radius configuration; clients do not supply a mask.

    Returns:
        A restored BGR uint8 array; no mask or image copy is returned by this stub.
    """
    raise NotImplementedError("Scratch reduction is not implemented.")
