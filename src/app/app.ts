import { isPlatformBrowser } from '@angular/common';
import { Component, DOCUMENT, PLATFORM_ID, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, skip } from 'rxjs';
import { BackToTopComponent } from './components/back-to-top/back-to-top.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, FooterComponent, BackToTopComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  readonly languageRO = inject(LanguageService).language;

  constructor() {
    // After every navigation but the first, move focus to the new page's heading
    // so screen readers announce it.
    inject(Router)
      .events.pipe(
        filter((event) => event instanceof NavigationEnd),
        skip(1),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.focusMainHeading());
  }

  /**
   * Moves focus to the main content in place. Following the `#main-content` link
   * would resolve against `<base href="/">` and open the home page instead.
   */
  skipToMainContent(event: Event): void {
    event.preventDefault();
    this.document.getElementById('main-content')?.focus();
  }

  private focusMainHeading(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const heading = this.document.querySelector<HTMLElement>('main h1');
    if (!heading) {
      return;
    }

    if (!heading.hasAttribute('tabindex')) {
      heading.setAttribute('tabindex', '-1');
    }
    heading.focus({ preventScroll: true });
  }
}
