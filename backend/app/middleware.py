"""ASGI safeguards that bound multipart request spooling before route handling."""

from collections.abc import Awaitable, Callable
from typing import Any

from starlette.responses import JSONResponse

ASGIMessage = dict[str, Any]
ASGIReceive = Callable[[], Awaitable[ASGIMessage]]
ASGISend = Callable[[ASGIMessage], Awaitable[None]]


class UploadBodyLimitMiddleware:
    """Bound the complete multipart body to the file limit plus framing overhead."""

    def __init__(self, app: Any, max_upload_bytes: int) -> None:
        self.app = app
        self.body_limit = max_upload_bytes + 64 * 1024

    async def __call__(self, scope: dict[str, Any], receive: ASGIReceive, send: ASGISend) -> None:
        if (
            scope["type"] != "http"
            or scope.get("method") != "POST"
            or scope.get("path") != "/api/upload"
        ):
            await self.app(scope, receive, send)
            return

        content_length = next(
            (value.decode("latin-1") for key, value in scope.get("headers", []) if key.lower() == b"content-length"),
            None,
        )
        if content_length is not None:
            try:
                if int(content_length) > self.body_limit:
                    await self._too_large(scope, receive, send)
                    return
            except ValueError:
                pass

        bytes_seen = 0
        overflow = False

        async def limited_receive() -> ASGIMessage:
            nonlocal bytes_seen, overflow
            message = await receive()
            if message["type"] == "http.request":
                bytes_seen += len(message.get("body", b""))
                if bytes_seen > self.body_limit:
                    overflow = True
                    return {"type": "http.disconnect"}
            return message

        async def limited_send(message: ASGIMessage) -> None:
            if not overflow:
                await send(message)

        try:
            await self.app(scope, limited_receive, limited_send)
        except Exception:
            if not overflow:
                raise
        if overflow:
            await self._too_large(scope, receive, send)

    @staticmethod
    async def _too_large(scope: dict[str, Any], receive: ASGIReceive, send: ASGISend) -> None:
        response = JSONResponse(
            status_code=413,
            content={
                "error": {
                    "code": "FILE_TOO_LARGE",
                    "message": "Tệp tải lên vượt quá giới hạn dung lượng.",
                    "details": None,
                }
            },
        )
        await response(scope, receive, send)
