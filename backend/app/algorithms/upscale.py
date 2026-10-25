"""Image-upscaling interface (intentionally unimplemented)."""

from __future__ import annotations

from app.algorithms.types import ImageArray, UpscaleParams


def upscale_image(image: ImageArray, params: UpscaleParams) -> ImageArray:
    """Upscale an image by a catalog-supported factor in a future implementation.

    Args:
        image: BGR uint8 NumPy image array.
        params: ``scale`` is 2 or 4; the pipeline must run this as its final step.

    Returns:
        An upscaled BGR uint8 array; interpolation and AI models are not implemented.
    """
    raise NotImplementedError("Image upscaling is not implemented.")
