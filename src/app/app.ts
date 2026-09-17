import {
  Component,
  signal,
  ChangeDetectionStrategy,
  DOCUMENT,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { BackToTopComponent } from './components/back-to-top/back-to-top.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SEOService } from './services/seo.service';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, FooterComponent, BackToTopComponent, RouterOutlet],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.css',
})
export class App {
  private router = inject(Router);
  private seoService = inject(SEOService);
  private doc = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);

  private isFirstNavigation = true;

  protected readonly title = signal('Imalo Education');

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Every route call resets robots via its own ngOnInit only when it needs
        // to opt out (e.g. the 404 page); this restores the indexable default
        // before the next route has a chance to run its own logic.
        this.seoService.resetRobotsToDefault();
      }

      if (event instanceof NavigationEnd) {
        if (this.isFirstNavigation) {
          this.isFirstNavigation = false;
          return;
        }
        this.focusMainHeading();
      }
    });
  }

  private focusMainHeading(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const heading = this.doc.querySelector<HTMLElement>('main h1');
    if (!heading) {
      return;
    }

    if (!heading.hasAttribute('tabindex')) {
      heading.setAttribute('tabindex', '-1');
    }
    heading.focus({ preventScroll: true });
  }
}
