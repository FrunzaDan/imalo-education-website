import { describe, expect, it, vi } from 'vitest';
import { parseGalleryImages } from './parsers';

describe('parseGalleryImages', () => {
  it('keeps well-formed images and drops unknown fields', () => {
    expect(parseGalleryImages([{ imagePath: '/a.webp', extra: true }])).toEqual(
      [{ imagePath: '/a.webp' }],
    );
  });

  it('skips malformed entries instead of failing the whole list', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(
      parseGalleryImages([
        { imagePath: '/a.webp' },
        { imagePath: '' },
        { imagePath: 3 },
        null,
      ]),
    ).toEqual([{ imagePath: '/a.webp' }]);
  });

  it('returns an empty list for anything that is not an array', () => {
    expect(parseGalleryImages({ imagePath: '/a.webp' })).toEqual([]);
    expect(parseGalleryImages(null)).toEqual([]);
  });
});
