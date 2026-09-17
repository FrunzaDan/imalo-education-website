import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
  Signal,
  effect,
  inject,
  signal,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { GalleryImage } from '../../interfaces/gallery-image';
import { LanguageService } from '../../services/language.service';
import { LoadGalleryService } from '../../services/load-gallery.service';
import { SEOService } from '../../services/seo.service';

@Component({
  selector: 'app-gallery',
  imports: [NgOptimizedImage],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryComponent implements OnInit {
  private loadGalleryService = inject(LoadGalleryService);
  private languageService = inject(LanguageService);
  private seoService = inject(SEOService);

  galleryImageList = signal<GalleryImage[]>([]);
  languageRO: Signal<boolean>;
  currentIndex = signal(-1);
  isFullViewOpen = signal(false);

  private touchStartX = 0;
  private touchEndX = 0;

  constructor() {
    this.languageRO = this.languageService.language;

    effect(() => {
      this.seoService.updateForLanguage(
        this.languageRO(),
        'Galeria Imalo Education, afterschool pe limba germana din Sibiu.',
        'Galerie von Imalo Education, dem deutschsprachigen Afterschool-Programm in Sibiu.',
      );
    });
  }

  ngOnInit(): void {
    this.seoService.createLinkForCanonicalURL();
    this.galleryImageList.set(this.loadGalleryService.loadGallery());
  }

  openFullView(index: number): void {
    this.currentIndex.set(index);
    this.isFullViewOpen.set(true);
  }

  closeFullView(): void {
    this.isFullViewOpen.set(false);
  }

  navigateLeft(): void {
    this.currentIndex.set(Math.max(0, this.currentIndex() - 1));
  }

  navigateRight(): void {
    this.currentIndex.set(
      Math.min(this.galleryImageList().length - 1, this.currentIndex() + 1),
    );
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (this.isFullViewOpen()) {
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
  }

  // Handle touch events for swipe navigation
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  private handleSwipe(): void {
    if (this.touchStartX - this.touchEndX > 50) {
      // Swipe Left
      this.navigateRight();
    }

    if (this.touchEndX - this.touchStartX > 50) {
      // Swipe Right
      this.navigateLeft();
    }
  }
}
