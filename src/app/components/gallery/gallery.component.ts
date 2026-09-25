import {
  Component,
  DOCUMENT,
  ElementRef,
  Injector,
  afterNextRender,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { GalleryImage } from '../../interfaces/gallery-image';
import { GalleryCatalogService } from '../../services/gallery-catalog.service';
import { LanguageService } from '../../services/language.service';
import { SeoService } from '../../services/seo.service';
import { trapTabKey } from '../../shared/focus-trap';

/** How far a finger has to travel sideways before it counts as a swipe. */
const SWIPE_THRESHOLD_PX = 50;

@Component({
  selector: 'app-gallery',
  imports: [NgOptimizedImage],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css',
  host: {
    '(document:keydown)': 'handleKeyboardEvent($event)',
    '(touchstart)': 'onTouchStart($event)',
    '(touchend)': 'onTouchEnd($event)',
  },
})
export class GalleryComponent {
  private readonly galleryCatalog = inject(GalleryCatalogService);
  private readonly seoService = inject(SeoService);
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private focusBeforeFullView: HTMLElement | null = null;

  private readonly fullView = viewChild<ElementRef<HTMLElement>>('fullView');
  private readonly closeButton =
    viewChild<ElementRef<HTMLButtonElement>>('closeButton');

  readonly languageRO = inject(LanguageService).language;
  readonly galleryImageList = this.galleryCatalog.images;
  readonly hasLoadError = this.galleryCatalog.hasLoadError;
  readonly currentIndex = signal(-1);
  readonly isFullViewOpen = signal(false);

  private touchStartX = 0;

  constructor() {
    effect(() => {
      this.seoService.updateMetaTags({
        description: this.languageRO()
          ? 'Galeria Imalo Education, afterschool pe limba germana din Sibiu.'
          : 'Galerie von Imalo Education, dem deutschsprachigen Afterschool-Programm in Sibiu.',
        path: '/gallery',
      });
    });
  }

  /** What the photo shows, in the page's language, or its number when it has no description. */
  describe(image: GalleryImage, index: number): string {
    const isRomanian = this.languageRO();
    if (image.description) {
      return isRomanian ? image.description.ro : image.description.de;
    }
    const total = this.galleryImageList().length;
    return isRomanian
      ? `Fotografia ${index + 1} din ${total}`
      : `Foto ${index + 1} von ${total}`;
  }

  /** Opens the photo and moves keyboard focus into the full view, remembering where it came from. */
  openFullView(index: number): void {
    const active = this.document.activeElement;
    this.focusBeforeFullView = active instanceof HTMLElement ? active : null;
    this.currentIndex.set(index);
    this.isFullViewOpen.set(true);
    afterNextRender(
      () => this.closeButton()?.nativeElement.focus({ preventScroll: true }),
      { injector: this.injector },
    );
  }

  closeFullView(): void {
    if (!this.isFullViewOpen()) return;
    this.isFullViewOpen.set(false);
    this.focusBeforeFullView?.focus({ preventScroll: true });
    this.focusBeforeFullView = null;
  }

  navigateLeft(): void {
    this.currentIndex.update((index) => Math.max(0, index - 1));
    this.keepFocusInFullView();
  }

  navigateRight(): void {
    const lastIndex = this.galleryImageList().length - 1;
    this.currentIndex.update((index) => Math.min(lastIndex, index + 1));
    this.keepFocusInFullView();
  }

  handleKeyboardEvent(event: KeyboardEvent): void {
    if (!this.isFullViewOpen()) return;

    switch (event.key) {
      case 'ArrowLeft':
        this.navigateLeft();
        break;
      case 'ArrowRight':
        this.navigateRight();
        break;
      case 'Escape':
        this.closeFullView();
        break;
      case 'Tab': {
        const fullView = this.fullView()?.nativeElement;
        if (fullView) trapTabKey(event, fullView);
        break;
      }
    }
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchEnd(event: TouchEvent): void {
    const swipeDistance = this.touchStartX - event.changedTouches[0].screenX;
    if (swipeDistance > SWIPE_THRESHOLD_PX) {
      this.navigateRight();
    } else if (swipeDistance < -SWIPE_THRESHOLD_PX) {
      this.navigateLeft();
    }
  }

  /**
   * At either end of the gallery the previous/next button goes away; if it has
   * focus, focus moves to the close button first instead of falling to the page behind.
   */
  private keepFocusInFullView(): void {
    const focusedId = this.document.activeElement?.id;
    const index = this.currentIndex();
    const isLeaving =
      (focusedId === 'prev-button' && index === 0) ||
      (focusedId === 'next-button' &&
        index === this.galleryImageList().length - 1);
    if (isLeaving) {
      this.closeButton()?.nativeElement.focus({ preventScroll: true });
    }
  }
}
