"""Safe, consistent API error responses."""

from collections.abc import Mapping
from typing import Any

from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException


class ApiError(Exception):
    """An expected, user-safe API failure."""

    def __init__(
        self,
        status_code: int,
        code: str,
        message: str,
        details: list[dict[str, str]] | None = None,
    ) -> None:
        super().__init__(message)
        self.status_code = status_code
        self.code = code
        self.message = message
        self.details = details


def error_body(
    code: str,
    message: str,
    details: list[dict[str, str]] | None = None,
) -> dict[str, Any]:
    return {"error": {"code": code, "message": message, "details": details}}


async def api_error_handler(_request: Request, exc: ApiError) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content=error_body(exc.code, exc.message, exc.details),
    )


def _validation_message(error: Mapping[str, Any]) -> str:
    error_type = str(error.get("type", ""))
    if error_type == "missing":
        return "Trường này là bắt buộc."
    if error_type == "extra_forbidden":
        return "Trường này không được hỗ trợ."
    if error_type in {"uuid_parsing", "uuid_version", "uuid_type"}:
        return "Định dạng UUID không hợp lệ."
    if error_type in {"string_type", "string_sub_type"}:
        return "Giá trị phải là chuỗi."
    if error_type in {"int_type", "int_parsing"}:
        return "Giá trị phải là số nguyên."
    if error_type in {"float_type", "float_parsing"}:
        return "Giá trị phải là số."
    if error_type in {"list_type", "too_short", "too_long"}:
        return "Danh sách có số phần tử không hợp lệ."
    if error_type in {"string_too_short", "string_too_long"}:
        return "Độ dài chuỗi không hợp lệ."
    return "Giá trị không hợp lệ."


async def validation_error_handler(
    _request: Request, exc: RequestValidationError
) -> JSONResponse:
    details: list[dict[str, str]] = []
    for error in exc.errors():
        location = error.get("loc", ())
        field = ".".join(str(part) for part in location if part not in {"body", "query", "path", "header"})
        details.append(
            {
                "field": field or "request",
                "message": _validation_message(error),
            }
        )
    return JSONResponse(
        status_code=422,
        content=error_body("VALIDATION_ERROR", "Dữ liệu yêu cầu không hợp lệ.", details),
    )


async def http_error_handler(
    _request: Request, exc: StarletteHTTPException
) -> JSONResponse:
    if exc.status_code == 404:
        code, message = "NOT_FOUND", "Đường dẫn không tồn tại."
    elif exc.status_code == 405:
        code, message = "METHOD_NOT_ALLOWED", "Phương thức yêu cầu không được hỗ trợ."
    else:
        code, message = "HTTP_ERROR", "Yêu cầu không thể được xử lý."
    return JSONResponse(status_code=exc.status_code, content=error_body(code, message))
