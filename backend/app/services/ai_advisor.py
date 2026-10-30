# Tương ứng AdvisorPanel.tsx và apiClient.advise(); hiện chỉ là interface chưa triển khai.
# Request HTTP có image_id/prompt/steps/current_result_id; route chưa gọi hàm này.
# original là mảng ảnh nội bộ sau khi backend đọc ảnh, không phải field FE gửi lên.
# Response tương lai khớp AdviceResponse: analysis và steps gồm algorithm, params, reason.
# FE kiểm tra đề xuất rồi áp dụng vào cấu hình; không tự chạy process khi áp dụng.

"""AI advisor interface (intentionally unimplemented)."""

from __future__ import annotations

from collections.abc import Sequence
from uuid import UUID

from app.algorithms.types import AdviceResult, ImageArray, PipelineStep


def advise_image(
    image_id: UUID,
    original: ImageArray,
    prompt: str,
    steps: Sequence[PipelineStep],
    current_result_id: UUID | None = None,
) -> AdviceResult:
    """Suggest restoration steps in a future real advisor implementation.

    Args:
        image_id: UUID of the uploaded original associated with the advice request.
        original: Original BGR uint8 NumPy image array.
        prompt: User's trimmed request, limited to 1..2000 characters by the API.
        steps: Current validated configuration in request order.
        current_result_id: Optional UUID of a real current result, when available.

    Returns:
        A real analysis and reasoned step list. No model, canned response, or SDK is used here.
    """
    raise NotImplementedError("The AI advisor is not implemented.")
