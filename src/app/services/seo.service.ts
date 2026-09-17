
import { Injectable, inject, DOCUMENT } from '@angular/core';
import { Meta } from '@angular/platform-browser';

const DEFAULT_ROBOTS_CONTENT =
  'index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large';

@Injectable({
  providedIn: 'root',
})
export class SEOService {
  private doc = inject<Document>(DOCUMENT);
  private meta = inject(Meta);


  updateRobots(content: string): void {
    this.meta.updateTag({ name: 'robots', content });
  }

  resetRobotsToDefault(): void {
    this.updateRobots(DEFAULT_ROBOTS_CONTENT);
  }

  updateMetaDescription(metaDescription: string): void {
    this.meta.updateTag({
      name: 'description',
      content: metaDescription,
    });
  }

  updateOpenGraphTags(description: string, locale = 'ro_RO'): void {
    const title = this.doc.title;
    const url = this.getCanonicalURL();

    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:locale', content: locale });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:url', content: url });
  }

  updateHtmlLang(lang: string): void {
    this.doc.documentElement.lang = lang;
  }

  /** Syncs description, OG/Twitter tags, and the `lang` attribute to the active language. */
  updateForLanguage(
    isRomanian: boolean,
    descriptionRO: string,
    descriptionDE: string,
  ): void {
    this.updateHtmlLang(isRomanian ? 'ro' : 'de');
    const description = isRomanian ? descriptionRO : descriptionDE;
    this.updateMetaDescription(description);
    this.updateOpenGraphTags(description, isRomanian ? 'ro_RO' : 'de_DE');
  }

  createLinkForCanonicalURL(): void {
    this.removeExistingCanonicalLink();

    const link: HTMLLinkElement = this.doc.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', this.getCanonicalURL());
    this.doc.head.appendChild(link);
  }

  private getCanonicalURL(): string {
    const firebaselink: string = 'https://imalo-education.web.app';
    let canonicalURL: string = this.getCurrentPath();

    // If the canonical URL is root "/", remove the trailing slash.
    if (canonicalURL === '/') {
      canonicalURL = '';
    }

    return firebaselink + canonicalURL;
  }

  private removeExistingCanonicalLink(): void {
    const existingLinks: NodeListOf<Element> = this.doc.head.querySelectorAll(
      'link[rel="canonical"]',
    );

    for (let i: number = 0; i < existingLinks.length; i++) {
      this.doc.head.removeChild(existingLinks[i]);
    }
  }

  private getCurrentPath(): string {
    // Extracts only the path and query string, excluding the protocol and domain.
    const url = new URL(this.doc.URL);
    return url.pathname + url.search;
  }
}
