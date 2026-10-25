"""Documented algorithm interfaces; no image-processing code is implemented."""

from app.algorithms.brightness import adjust_gamma
from app.algorithms.colorize import colorize_image
from app.algorithms.contrast import enhance_clahe
from app.algorithms.denoise import denoise_bilateral, denoise_median
from app.algorithms.scratches import detect_scratches, reduce_scratches
from app.algorithms.sharpen import sharpen_unsharp
from app.algorithms.upscale import upscale_image
from app.algorithms.yellowing import remove_yellow_cast

__all__ = [
    "adjust_gamma",
    "colorize_image",
    "denoise_bilateral",
    "denoise_median",
    "detect_scratches",
    "enhance_clahe",
    "reduce_scratches",
    "remove_yellow_cast",
    "sharpen_unsharp",
    "upscale_image",
]
