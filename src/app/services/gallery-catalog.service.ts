import { httpResource } from '@angular/common/http';
import { computed, Injectable } from '@angular/core';
import { GalleryImage } from '../interfaces/gallery-image';
import { parseGalleryImages } from '../shared/parsers';

/** The gallery images, loaded once from `public/assets` and shared by every page that shows them. */
@Injectable({
  providedIn: 'root',
})
export class GalleryCatalogService {
  private readonly galleryResource = httpResource(
    () => '/assets/galleryImages.json',
    { parse: parseGalleryImages },
  );

  // `value()` throws while the resource is in its error state, so check `hasValue()` first.
  readonly images = computed((): readonly GalleryImage[] =>
    this.galleryResource.hasValue() ? this.galleryResource.value() : [],
  );
  readonly isLoading = this.galleryResource.isLoading;
  readonly hasLoadError = computed(
    () => this.galleryResource.error() !== undefined,
  );

  reload(): void {
    this.galleryResource.reload();
  }
}
