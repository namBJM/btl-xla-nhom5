import { describe, expect, it, vi } from "vitest";
import {
  MAX_UPLOAD_BYTES,
  validateAndDecodeImage,
  type ImageDecoder,
} from "./image-validation";

const JPEG_SIGNATURE = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46]);
const PNG_SIGNATURE = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

describe("validateAndDecodeImage", () => {
  it("accepts JPEG content when the filename and MIME type say PNG", async () => {
    const file = new File([JPEG_SIGNATURE], "family.png", { type: "image/png" });
    const decoder: ImageDecoder = vi.fn(async (blob: Blob) => {
      expect(blob.type).toBe("image/jpeg");
      return { width: 12, height: 8 };
    });

    const result = await validateAndDecodeImage(file, decoder);

    expect(result).toMatchObject({ width: 12, height: 8 });
    expect(result.previewBlob.type).toBe("image/jpeg");
    expect([...new Uint8Array(await result.previewBlob.arrayBuffer())]).toEqual([...JPEG_SIGNATURE]);
    expect(file.name).toBe("family.png");
    expect(file.type).toBe("image/png");
  });

  it("accepts PNG content when the filename and MIME type say JPEG", async () => {
    const file = new File([PNG_SIGNATURE], "family.jpg", { type: "image/jpeg" });
    const decoder: ImageDecoder = vi.fn(async (blob: Blob) => {
      expect(blob.type).toBe("image/png");
      return { width: 9, height: 7 };
    });

    const result = await validateAndDecodeImage(file, decoder);

    expect(result).toMatchObject({ width: 9, height: 7 });
    expect(result.previewBlob.type).toBe("image/png");
    expect([...new Uint8Array(await result.previewBlob.arrayBuffer())]).toEqual([...PNG_SIGNATURE]);
    expect(file.name).toBe("family.jpg");
    expect(file.type).toBe("image/jpeg");
  });

  it("rejects unsupported content even when the name and MIME claim JPEG", async () => {
    const file = new File([Uint8Array.from([0x47, 0x49, 0x46, 0x38])], "photo.jpg", {
      type: "image/jpeg",
    });
    const decoder: ImageDecoder = vi.fn(async () => ({ width: 8, height: 6 }));

    await expect(validateAndDecodeImage(file, decoder)).rejects.toThrow("JPG hoặc PNG");
    expect(decoder).not.toHaveBeenCalled();
  });

  it("rejects empty files before decoding", async () => {
    const file = new File([], "empty.jpg", { type: "image/jpeg" });
    const decoder: ImageDecoder = vi.fn(async () => ({ width: 8, height: 6 }));

    await expect(validateAndDecodeImage(file, decoder)).rejects.toThrow("đang trống");
    expect(decoder).not.toHaveBeenCalled();
  });

  it("rejects files over the byte limit before decoding", async () => {
    const oversizedBytes = new Uint8Array(MAX_UPLOAD_BYTES + 1);
    oversizedBytes.set(JPEG_SIGNATURE);
    const file = new File([oversizedBytes], "large.jpg", { type: "image/jpeg" });
    const decoder: ImageDecoder = vi.fn(async () => ({ width: 8, height: 6 }));

    await expect(validateAndDecodeImage(file, decoder)).rejects.toThrow("10 MB");
    expect(decoder).not.toHaveBeenCalled();
  });

  it("rejects decoded images over the pixel limit", async () => {
    const file = new File([PNG_SIGNATURE], "large.png", { type: "image/png" });
    const decoder: ImageDecoder = vi.fn(async () => ({ width: 5_000, height: 4_001 }));

    await expect(validateAndDecodeImage(file, decoder)).rejects.toThrow("20 triệu điểm ảnh");
  });

  it("rejects supported signatures that the browser cannot decode", async () => {
    const file = new File([JPEG_SIGNATURE], "undecodable.jpg", { type: "image/jpeg" });
    const decoder: ImageDecoder = vi.fn(async () => {
      throw new Error("decode failed");
    });

    await expect(validateAndDecodeImage(file, decoder)).rejects.toThrow("decode failed");
  });
});
