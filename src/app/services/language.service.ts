import { DOCUMENT, computed, effect, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

/** The URL prefix of the German pages; the Romanian pages have none. */
export const GERMAN_PREFIX = '/de';

function isGermanUrl(url: string): boolean {
  const path = url.split(/[?#]/)[0];
  return path === GERMAN_PREFIX || path.startsWith(GERMAN_PREFIX + '/');
}

/** Strips the language prefix, so `/de/offers` and `/offers` both give `/offers`. */
export function toRomanianPath(url: string): string {
  const path = url.split(/[?#]/)[0];
  return isGermanUrl(path) ? path.slice(GERMAN_PREFIX.length) || '/' : path;
}

/** Adds the German prefix to a Romanian path, so `/offers` gives `/de/offers`. */
export function toGermanPath(romanianPath: string): string {
  return romanianPath === '/' ? GERMAN_PREFIX : GERMAN_PREFIX + romanianPath;
}

/** Pages with no German version, and the page whose German version opens instead. */
const GERMAN_FALLBACKS: Readonly<Record<string, string>> = {
  '/privacy': '/',
};

/**
 * The site's language, taken from the URL: Romanian by default, German under `/de`.
 * Each language has its own URLs so that search engines can index both.
 */
@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  /** `true` while the site is shown in Romanian. */
  readonly language = computed(() => !isGermanUrl(this.url()));

  constructor() {
    effect(() => {
      this.document.documentElement.lang = this.language() ? 'ro' : 'de';
    });
  }

  /** The given Romanian path in the current language, such as `/de/offers` for `/offers`. */
  localize(romanianPath: string): string {
    return this.language() ? romanianPath : toGermanPath(romanianPath);
  }

  /** Opens the current page in the other language. */
  toggleLanguage(): Promise<boolean> {
    const romanianPath = toRomanianPath(this.router.url);
    const target = this.language()
      ? toGermanPath(GERMAN_FALLBACKS[romanianPath] ?? romanianPath)
      : romanianPath;
    return this.router.navigateByUrl(target);
  }
}
