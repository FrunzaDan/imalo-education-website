import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SEOService } from './seo.service';

describe('SEOService', () => {
  let service: SEOService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SEOService);
  });

  afterEach(() => {
    document.head
      .querySelectorAll(
        'link[rel="canonical"], meta[property^="og:"], meta[name^="twitter:"], meta[name="description"]',
      )
      .forEach((el) => el.remove());
  });

  it('builds the canonical link from the production domain and current path', () => {
    window.history.pushState({}, '', '/gallery?tab=recent');

    service.createLinkForCanonicalURL();

    const link = document.head.querySelector('link[rel="canonical"]');
    expect(link?.getAttribute('href')).toBe(
      'https://imalo-education.web.app/gallery?tab=recent',
    );
  });

  it('drops the trailing slash for the root path', () => {
    window.history.pushState({}, '', '/');

    service.createLinkForCanonicalURL();

    const link = document.head.querySelector('link[rel="canonical"]');
    expect(link?.getAttribute('href')).toBe('https://imalo-education.web.app');
  });

  it('replaces the previous canonical link instead of stacking a new one', () => {
    window.history.pushState({}, '', '/offers');
    service.createLinkForCanonicalURL();

    window.history.pushState({}, '', '/schedule');
    service.createLinkForCanonicalURL();

    const links = document.head.querySelectorAll('link[rel="canonical"]');
    expect(links.length).toBe(1);
    expect(links[0].getAttribute('href')).toBe(
      'https://imalo-education.web.app/schedule',
    );
  });

  it('sets the meta description tag', () => {
    service.updateMetaDescription('Afterschool germana Sibiu');

    const meta = document.querySelector('meta[name="description"]');
    expect(meta?.getAttribute('content')).toBe('Afterschool germana Sibiu');
  });

  it('derives Open Graph and Twitter tags from the document title and canonical URL', () => {
    document.title = 'Galerie - Imalo Afterschool Germana Sibiu';
    window.history.pushState({}, '', '/gallery');

    service.updateOpenGraphTags('Galeria Imalo Education.');

    expect(
      document
        .querySelector('meta[property="og:title"]')
        ?.getAttribute('content'),
    ).toBe('Galerie - Imalo Afterschool Germana Sibiu');
    expect(
      document
        .querySelector('meta[property="og:description"]')
        ?.getAttribute('content'),
    ).toBe('Galeria Imalo Education.');
    expect(
      document
        .querySelector('meta[property="og:url"]')
        ?.getAttribute('content'),
    ).toBe('https://imalo-education.web.app/gallery');
    expect(
      document
        .querySelector('meta[name="twitter:url"]')
        ?.getAttribute('content'),
    ).toBe('https://imalo-education.web.app/gallery');
  });
});
