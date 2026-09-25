import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { LanguageService, toGermanPath } from './language.service';

/** Where the site is published; canonical links and social previews point here. */
export const SITE_URL = 'https://imalo-education.web.app';

export interface SeoMetaConfig {
  description: string;
  /** The page's Romanian path, such as `/gallery`; the German one is derived from it. */
  path: string;
  /** A picture for link previews, such as `/assets/images/imalo.webp`. */
  image?: string;
  robots?: string;
  /** `false` for pages without a German version, which get no `hreflang` links. */
  hasGermanVersion?: boolean;
}

/** The home page's URL has no trailing slash, like every other page's. */
function toAbsoluteUrl(path: string): string {
  return SITE_URL + (path === '/' ? '' : path);
}

const DEFAULT_ROBOTS =
  'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly languageService = inject(LanguageService);

  /**
   * Call after the page title is set, since the social title is copied from it.
   * The canonical URL and locale follow the language of the current URL.
   */
  updateMetaTags(config: SeoMetaConfig): void {
    const title = this.document.title;
    const isRomanian = this.languageService.language();
    const romanianUrl = toAbsoluteUrl(config.path);
    const germanUrl = toAbsoluteUrl(toGermanPath(config.path));
    const url = isRomanian ? romanianUrl : germanUrl;

    this.meta.updateTag({ name: 'description', content: config.description });
    this.meta.updateTag({
      name: 'robots',
      content: config.robots ?? DEFAULT_ROBOTS,
    });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({
      property: 'og:description',
      content: config.description,
    });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({
      property: 'og:locale',
      content: isRomanian ? 'ro_RO' : 'de_DE',
    });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({
      name: 'twitter:description',
      content: config.description,
    });
    this.meta.updateTag({ name: 'twitter:url', content: url });

    if (config.image) {
      this.meta.updateTag({
        property: 'og:image',
        content: SITE_URL + config.image,
      });
      this.meta.updateTag({
        name: 'twitter:image',
        content: SITE_URL + config.image,
      });
    }

    this.updateCanonicalUrl(url);
    this.updateAlternateUrls(
      config.hasGermanVersion === false
        ? []
        : [
            ['ro', romanianUrl],
            ['de', germanUrl],
            ['x-default', romanianUrl],
          ],
    );
  }

  /** Points search engines to the same page in the other language. */
  private updateAlternateUrls(
    alternates: readonly (readonly [hreflang: string, url: string])[],
  ): void {
    this.document.head
      .querySelectorAll('link[rel="alternate"][hreflang]')
      .forEach((link) => link.remove());

    for (const [hreflang, url] of alternates) {
      const link = this.document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', hreflang);
      link.setAttribute('href', url);
      this.document.head.appendChild(link);
    }
  }

  private updateCanonicalUrl(url: string): void {
    let link: HTMLLinkElement | null = this.document.querySelector(
      'link[rel="canonical"]',
    );
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
