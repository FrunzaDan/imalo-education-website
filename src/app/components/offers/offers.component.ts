import { NgOptimizedImage, ViewportScroller } from '@angular/common';
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
import { LanguageService } from '../../services/language.service';
import { SeoService } from '../../services/seo.service';
import { trapTabKey } from '../../shared/focus-trap';

@Component({
  selector: 'app-offers',
  imports: [NgOptimizedImage],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.css',
})
export class OffersComponent {
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly seoService = inject(SeoService);
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private focusBeforeModal: HTMLElement | null = null;

  private readonly courseModal =
    viewChild<ElementRef<HTMLElement>>('courseModal');

  readonly languageRO = inject(LanguageService).language;
  readonly isCourseModalOpen = signal(false);
  readonly courseTitle = signal<string | null>(null);

  constructor() {
    effect(() => {
      const isRomanian = this.languageRO();
      this.seoService.updateMetaTags({
        description: isRomanian
          ? 'Pagina cu oferte Imalo Education, afterschool pe limba germana din Sibiu.'
          : 'Angebotsseite von Imalo Education, dem deutschsprachigen Afterschool-Programm in Sibiu.',
        path: '/offers',
      });
    });
  }

  /** Opens the modal and moves keyboard focus into it, remembering where it came from. */
  openCourseModal(selectedCourseTitle: string): void {
    const active = this.document.activeElement;
    this.focusBeforeModal = active instanceof HTMLElement ? active : null;
    this.courseTitle.set(selectedCourseTitle);
    this.isCourseModalOpen.set(true);
    afterNextRender(
      () => this.courseModal()?.nativeElement.focus({ preventScroll: true }),
      { injector: this.injector },
    );
  }

  closeCourseModal(): void {
    this.isCourseModalOpen.set(false);
    this.courseTitle.set(null);
    this.focusBeforeModal?.focus({ preventScroll: true });
    this.focusBeforeModal = null;
  }

  onModalKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeCourseModal();
      return;
    }
    const modal = this.courseModal()?.nativeElement;
    if (event.key === 'Tab' && modal) {
      trapTabKey(event, modal);
    }
  }

  scrollToSection(elementId: string): void {
    this.viewportScroller.scrollToAnchor(elementId);
  }
}
