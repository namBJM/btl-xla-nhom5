"""All algorithm, pipeline, and advisor functions stay explicit stubs."""

from uuid import uuid4

import pytest

from app.algorithms.brightness import adjust_gamma
from app.algorithms.colorize import colorize_image
from app.algorithms.contrast import enhance_clahe
from app.algorithms.denoise import denoise_bilateral, denoise_median
from app.algorithms.scratches import detect_scratches, reduce_scratches
from app.algorithms.sharpen import sharpen_unsharp
from app.algorithms.upscale import upscale_image
from app.algorithms.yellowing import remove_yellow_cast
from app.pipeline import process_image
from app.services.ai_advisor import advise_image


@pytest.mark.parametrize(
    ("function", "args"),
    [
        (denoise_median, (object(), {"kernel_size": 3})),
        (denoise_bilateral, (object(), {"diameter": 5, "sigma_color": 50, "sigma_space": 50})),
        (adjust_gamma, (object(), {"gamma": 1})),
        (enhance_clahe, (object(), {"clip_limit": 2, "tile_grid_size": 8})),
        (sharpen_unsharp, (object(), {"amount": 0.8, "sigma": 1})),
        (detect_scratches, (object(), {"sensitivity": 0.5, "inpaint_radius": 3})),
        (reduce_scratches, (object(), {"sensitivity": 0.5, "inpaint_radius": 3})),
        (remove_yellow_cast, (object(), {"strength": 0.5})),
        (colorize_image, (object(), {"strength": 1})),
        (upscale_image, (object(), {"scale": 2})),
        (process_image, (object(), [])),
        (advise_image, (uuid4(), object(), "request", [], None)),
    ],
)
def test_processing_and_ai_interfaces_raise_not_implemented(function, args):
    with pytest.raises(NotImplementedError):
        function(*args)
