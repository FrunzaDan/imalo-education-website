
import { Injectable, inject, DOCUMENT } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SEOService {
  private doc = inject<Document>(DOCUMENT);
  private meta = inject(Meta);


  updateMetaDescription(metaDescription: string): void {
    this.meta.updateTag({
      name: 'description',
      content: metaDescription,
    });
  }

  updateOpenGraphTags(description: string): void {
    const title = this.doc.title;
    const url = this.getCanonicalURL();

    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:url', content: url });
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
