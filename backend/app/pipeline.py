"""Processing pipeline interface (intentionally unimplemented)."""

from __future__ import annotations

from collections.abc import Sequence

from app.algorithms.types import ImageArray, PipelineStep


def process_image(original: ImageArray, steps: Sequence[PipelineStep]) -> ImageArray:
    """Execute the validated steps in request order in a future implementation.

    Args:
        original: Original BGR uint8 NumPy image array; callers retain the original.
        steps: Validated algorithm identifiers and numeric parameter dictionaries.

    Returns:
        A newly processed BGR uint8 array. No step is executed by this scaffold.
    """
    raise NotImplementedError("The image processing pipeline is not implemented.")
