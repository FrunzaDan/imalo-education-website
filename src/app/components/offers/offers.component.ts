import {
  DOCUMENT,
  isPlatformBrowser,
  NgOptimizedImage,
  ViewportScroller,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Signal,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { SEOService } from '../../services/seo.service';
import { trapTabKey } from '../../utils/focus-trap';

@Component({
  selector: 'app-offers',
  imports: [NgOptimizedImage],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffersComponent implements OnInit, OnDestroy {
  private languageService = inject(LanguageService);
  private viewportScroller = inject(ViewportScroller);
  private seoService = inject(SEOService);
  private doc = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);

  isCourseModalOpen = signal(false);
  courseTitle?: string;
  languageRO: Signal<boolean>;

  private courseModal = viewChild<ElementRef<HTMLElement>>('courseModal');
  private lastFocusedElement: HTMLElement | null = null;

  constructor() {
    this.languageRO = this.languageService.language;

    effect(() => {
      this.seoService.updateForLanguage(
        this.languageRO(),
        'Pagina cu oferte Imalo Education, afterschool pe limba germana din Sibiu.',
        'Angebotsseite von Imalo Education, dem deutschsprachigen Afterschool-Programm in Sibiu.',
      );
    });

    effect(() => {
      const modal = this.courseModal()?.nativeElement;
      if (
        this.isCourseModalOpen() &&
        modal &&
        isPlatformBrowser(this.platformId)
      ) {
        modal.focus({ preventScroll: true });
      }
    });
  }

  ngOnInit(): void {
    this.seoService.createLinkForCanonicalURL();
  }

  ngOnDestroy(): void {
    this.courseTitle = undefined;
  }

  openCourseModal(selectedCourseTitile?: string): void {
    this.lastFocusedElement = this.doc.activeElement as HTMLElement | null;
    this.isCourseModalOpen.set(true);
    this.courseTitle = selectedCourseTitile;
  }

  closeCourseModal(): void {
    this.isCourseModalOpen.set(false);
    this.courseTitle = undefined;
    this.lastFocusedElement?.focus();
    this.lastFocusedElement = null;
  }

  onModalKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeCourseModal();
      return;
    }
    if (event.key === 'Tab') {
      const modal = this.courseModal()?.nativeElement;
      if (modal) {
        trapTabKey(event, modal);
      }
    }
  }

  public scrollToSection(elementId: string): void {
    this.viewportScroller.scrollToAnchor(elementId);
  }
}
