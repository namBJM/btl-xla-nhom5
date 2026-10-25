"""Isolated API test fixtures and test-only generated images."""

from io import BytesIO

import pytest
from fastapi.testclient import TestClient
from PIL import Image

from app.config import Settings
from app.main import create_app


@pytest.fixture
def settings(tmp_path):
    return Settings(storage_dir=tmp_path / "storage")


@pytest.fixture
def app(settings):
    return create_app(settings)


@pytest.fixture
def client(app):
    with TestClient(app) as test_client:
        yield test_client


def image_bytes(image_format: str = "JPEG", size: tuple[int, int] = (8, 6)) -> bytes:
    """Create a small valid test image; production never fabricates image results."""

    image = Image.new("RGB", size, color=(85, 120, 160))
    output = BytesIO()
    image.save(output, format=image_format)
    return output.getvalue()
