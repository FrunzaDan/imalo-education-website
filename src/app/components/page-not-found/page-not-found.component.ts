import { Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-page-not-found',
  imports: [RouterLink],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css',
})
export class PageNotFoundComponent {
  private readonly seoService = inject(SeoService);
  private readonly languageService = inject(LanguageService);

  readonly languageRO = this.languageService.language;
  readonly homeLink = () => this.languageService.localize('/');

  constructor() {
    effect(() => {
      this.seoService.updateMetaTags({
        description: this.languageRO()
          ? 'Pagina căutată nu există sau a fost mutată.'
          : 'Die gesuchte Seite existiert nicht oder wurde verschoben.',
        path: '/404',
        robots: 'noindex, follow',
        hasGermanVersion: false,
      });
    });
  }
}
