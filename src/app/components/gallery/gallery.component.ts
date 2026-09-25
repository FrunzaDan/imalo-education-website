import { Component, effect, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { GalleryCatalogService } from '../../services/gallery-catalog.service';
import { LanguageService } from '../../services/language.service';
import { SeoService } from '../../services/seo.service';

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

  readonly languageRO = inject(LanguageService).language;
  readonly galleryImageList = this.galleryCatalog.images;
  readonly hasLoadError = this.galleryCatalog.hasLoadError;
  readonly currentIndex = signal(-1);
  readonly isFullViewOpen = signal(false);

  private touchStartX = 0;

  constructor() {
    effect(() => {
      const isRomanian = this.languageRO();
      this.seoService.updateMetaTags({
        description: isRomanian
          ? 'Galeria Imalo Education, afterschool pe limba germana din Sibiu.'
          : 'Galerie von Imalo Education, dem deutschsprachigen Afterschool-Programm in Sibiu.',
        path: '/gallery',
        locale: isRomanian ? 'ro_RO' : 'de_DE',
      });
    });
  }

  openFullView(index: number): void {
    this.currentIndex.set(index);
    this.isFullViewOpen.set(true);
  }

  closeFullView(): void {
    this.isFullViewOpen.set(false);
  }

  navigateLeft(): void {
    this.currentIndex.update((index) => Math.max(0, index - 1));
  }

  navigateRight(): void {
    const lastIndex = this.galleryImageList().length - 1;
    this.currentIndex.update((index) => Math.min(lastIndex, index + 1));
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
}
