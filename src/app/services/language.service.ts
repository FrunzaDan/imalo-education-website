import { DOCUMENT, effect, inject, Injectable, signal } from '@angular/core';

/** The site's language: Romanian by default, German when switched. */
@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly document = inject(DOCUMENT);
  private readonly isRomanian = signal(true);

  /** `true` while the site is shown in Romanian. */
  readonly language = this.isRomanian.asReadonly();

  constructor() {
    effect(() => {
      this.document.documentElement.lang = this.isRomanian() ? 'ro' : 'de';
    });
  }

  toggleLanguage(): void {
    this.isRomanian.update((isRomanian) => !isRomanian);
  }
}
