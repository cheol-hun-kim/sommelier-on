/**
 * Strict client-side image upload validation utility.
 * Blocks SVG/HTML payloads (XSS vector) and enforces MIME, extension, and size limits.
 */
const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/heic',
  'image/heif',
]);

const ALLOWED_IMAGE_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.heic',
  '.heif',
]);

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageFile(
  file: File,
  maxBytes: number = 10 * 1024 * 1024
): FileValidationResult {
  if (!file || typeof file.name !== 'string') {
    return { valid: false, error: '유효하지 않은 파일입니다.' };
  }

  const lowerName = file.name.toLowerCase();
  const dotIdx = lowerName.lastIndexOf('.');
  const ext = dotIdx >= 0 ? lowerName.slice(dotIdx) : '';

  // Explicitly block SVG and non-image extensions
  if (file.type === 'image/svg+xml' || ext === '.svg' || !ALLOWED_IMAGE_EXTENSIONS.has(ext)) {
    return {
      valid: false,
      error: 'JPG, PNG, WEBP, GIF, HEIC 형식의 이미지 파일만 업로드할 수 있습니다.',
    };
  }

  if (file.type && !ALLOWED_IMAGE_MIME_TYPES.has(file.type.toLowerCase())) {
    return {
      valid: false,
      error: '허용되지 않은 이미지 MIME 형식입니다.',
    };
  }

  if (file.size <= 0 || file.size > maxBytes) {
    const maxMb = Math.round(maxBytes / (1024 * 1024));
    return {
      valid: false,
      error: `이미지 크기는 최대 ${maxMb}MB 이하만 업로드할 수 있습니다.`,
    };
  }

  return { valid: true };
}

/**
 * Verifies real binary magic bytes on the client to block disguised SVG/HTML/XML/PostScript files.
 */
export async function validateImageFileSignature(file: File): Promise<FileValidationResult> {
  try {
    const headBuf = await file.slice(0, 64).arrayBuffer();
    const bytes = new Uint8Array(headBuf);
    if (bytes.length < 4) {
      return { valid: false, error: '손상되었거나 비어 있는 이미지 파일입니다.' };
    }

    const asciiHead = String.fromCharCode(...bytes).trimStart().toLowerCase();
    if (
      asciiHead.startsWith('<svg') ||
      asciiHead.startsWith('<?xml') ||
      asciiHead.startsWith('<!doctype') ||
      asciiHead.startsWith('<html') ||
      asciiHead.startsWith('<script') ||
      asciiHead.startsWith('%!ps')
    ) {
      return { valid: false, error: '보안상 허용되지 않는 파일 형식입니다.' };
    }

    const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    const isPng =
      bytes.length >= 8 &&
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a;
    const isGif =
      bytes.length >= 6 &&
      bytes[0] === 0x47 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x38 &&
      (bytes[4] === 0x37 || bytes[4] === 0x39) &&
      bytes[5] === 0x61;
    const isWebp =
      bytes.length >= 12 &&
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50;
    const isHeif =
      bytes.length >= 12 &&
      bytes[4] === 0x66 &&
      bytes[5] === 0x74 &&
      bytes[6] === 0x79 &&
      bytes[7] === 0x70;

    if (!isJpeg && !isPng && !isGif && !isWebp && !isHeif) {
      return { valid: false, error: '파일 내용과 확장자가 일치하는 실제 이미지 파일만 업로드해 주세요.' };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: '이미지 파일 검증 중 오류가 발생했습니다.' };
  }
}
