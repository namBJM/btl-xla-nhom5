export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export const MAX_IMAGE_PIXELS = 20_000_000;

export type ImageDimensions = { width: number; height: number };
export type ImageDecoder = (blob: Blob) => Promise<ImageDimensions>;
export type ValidatedImage = ImageDimensions & { previewBlob: Blob };

export async function validateAndDecodeImage(
  file: File,
  decode: ImageDecoder = decodeDimensions,
): Promise<ValidatedImage> {
  if (file.size === 0) throw new Error("Tệp ảnh đang trống hoặc không đọc được.");
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("Ảnh vượt quá giới hạn 10 MB.");

  const signature = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  const isPng =
    signature.length >= 8 &&
    signature[0] === 0x89 && signature[1] === 0x50 && signature[2] === 0x4e &&
    signature[3] === 0x47 && signature[4] === 0x0d && signature[5] === 0x0a &&
    signature[6] === 0x1a && signature[7] === 0x0a;
  const isJpeg = signature.length >= 3 && signature[0] === 0xff && signature[1] === 0xd8 && signature[2] === 0xff;

  const contentType = isPng ? "image/png" : isJpeg ? "image/jpeg" : null;
  if (!contentType) throw new Error("Chỉ nhận nội dung ảnh JPG hoặc PNG hợp lệ.");

  // Give the decoder and local preview a content-based MIME type. The uploaded
  // File itself remains untouched, including its original bytes and filename.
  const previewBlob = file.slice(0, file.size, contentType);
  const dimensions = await decode(previewBlob);
  if (
    !Number.isSafeInteger(dimensions.width) || dimensions.width < 1 ||
    !Number.isSafeInteger(dimensions.height) || dimensions.height < 1
  ) {
    throw new Error("Kích thước ảnh không hợp lệ.");
  }
  if (dimensions.width * dimensions.height > MAX_IMAGE_PIXELS) {
    throw new Error("Ảnh vượt quá giới hạn 20 triệu điểm ảnh.");
  }
  return { ...dimensions, previewBlob };
}

async function decodeDimensions(blob: Blob): Promise<ImageDimensions> {
  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(blob);
    try {
      return { width: bitmap.width, height: bitmap.height };
    } finally {
      bitmap.close();
    }
  }

  const objectUrl = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.src = objectUrl;
    await image.decode();
    return { width: image.naturalWidth, height: image.naturalHeight };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
