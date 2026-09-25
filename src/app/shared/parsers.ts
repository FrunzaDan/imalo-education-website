import { GalleryImage } from '../interfaces/gallery-image';

// Data from the JSON files in `public/assets` is only trusted after it has
// been checked here; anything malformed is dropped instead of cast.

type UnknownRecord = Readonly<Record<string, unknown>>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null;
}

function isNonBlankString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

export function parseGalleryImage(value: unknown): GalleryImage | undefined {
  if (!isRecord(value)) return undefined;
  const { imagePath } = value;
  if (!isNonBlankString(imagePath)) return undefined;
  return { imagePath };
}

export function parseGalleryImages(value: unknown): GalleryImage[] {
  return parseList(value, parseGalleryImage);
}

function parseList<T>(
  value: unknown,
  parseItem: (item: unknown) => T | undefined,
): T[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const parsed = parseItem(item);
    if (parsed === undefined) {
      console.warn('Skipping malformed item:', item);
      return [];
    }
    return [parsed];
  });
}
