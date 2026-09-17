import { NgOptimizedImage, ViewportScroller } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  Signal,
  effect,
  inject,
  signal,
} from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { SEOService } from '../../services/seo.service';

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

  isCourseModalOpen = signal(false);
  courseTitle?: string;
  languageRO: Signal<boolean>;

  constructor() {
    this.languageRO = this.languageService.language;

    effect(() => {
      this.seoService.updateForLanguage(
        this.languageRO(),
        'Pagina cu oferte Imalo Education, afterschool pe limba germana din Sibiu.',
        'Angebotsseite von Imalo Education, dem deutschsprachigen Afterschool-Programm in Sibiu.',
      );
    });
  }

  ngOnInit(): void {
    this.seoService.createLinkForCanonicalURL();
  }

  ngOnDestroy(): void {
    this.courseTitle = undefined;
  }

  openCourseModal(selectedCourseTitile?: string): void {
    this.isCourseModalOpen.set(true);
    this.courseTitle = selectedCourseTitile;
  }

  closeCourseModal(): void {
    this.isCourseModalOpen.set(false);
    this.courseTitle = undefined;
  }

  public scrollToSection(elementId: string): void {
    this.viewportScroller.scrollToAnchor(elementId);
  }
}
