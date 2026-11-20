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
