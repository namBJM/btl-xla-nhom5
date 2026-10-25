import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiClient } from "./api-client";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("apiClient errors", () => {
  it("preserves a contract 501 error code and message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        Response.json(
          {
            error: {
              code: "NOT_IMPLEMENTED",
              message: "Chức năng xử lý ảnh chưa được triển khai.",
              details: null,
            },
          },
          { status: 501 },
        ),
      ),
    );

    await expect(apiClient.process({ image_id: "id", steps: [] })).rejects.toMatchObject({
      name: "ApiError",
      status: 501,
      code: "NOT_IMPLEMENTED",
      message: "Chức năng xử lý ảnh chưa được triển khai.",
    });
  });

  it("distinguishes a network failure from a backend not-implemented response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));

    try {
      await apiClient.catalog();
      throw new Error("Expected the catalog request to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error).toMatchObject({
        status: null,
        code: "NETWORK_ERROR",
        message: "Không thể kết nối máy chủ. Hãy kiểm tra backend rồi thử lại.",
      });
    }
  });

  it("joins server image paths against the configured backend base", () => {
    expect(apiClient.imageUrl("/api/images/id")).toBe("http://127.0.0.1:8000/api/images/id");
  });
});
