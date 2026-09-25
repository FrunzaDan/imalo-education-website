export interface GalleryImage {
  readonly imagePath: string;
  /** What the photo shows, for screen readers; photos without one get a numbered label. */
  readonly description?: {
    readonly ro: string;
    readonly de: string;
  };
}
