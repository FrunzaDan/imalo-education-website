import { describe, expect, it, vi } from 'vitest';
import { parseGalleryImages } from './parsers';

describe('parseGalleryImages', () => {
  it('keeps well-formed images and drops unknown fields', () => {
    expect(parseGalleryImages([{ imagePath: '/a.webp', extra: true }])).toEqual(
      [{ imagePath: '/a.webp' }],
    );
  });

  it('keeps a description only when it has both languages', () => {
    const description = { ro: 'Sală de clasă', de: 'Klassenzimmer' };

    expect(
      parseGalleryImages([
        { imagePath: '/a.webp', description },
        { imagePath: '/b.webp', description: { ro: 'Sală de clasă' } },
      ]),
    ).toEqual([
      { imagePath: '/a.webp', description },
      { imagePath: '/b.webp' },
    ]);
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
