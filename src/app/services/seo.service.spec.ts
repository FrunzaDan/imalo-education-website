import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { SeoService, SITE_URL } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;

  const metaContent = (selector: string) =>
    document.head.querySelector(`meta[${selector}]`)?.getAttribute('content');
  const canonicalLinks = () =>
    document.head.querySelectorAll('link[rel="canonical"]');
  const alternateLinks = () =>
    Array.from(
      document.head.querySelectorAll('link[rel="alternate"][hreflang]'),
      (link) => [link.getAttribute('hreflang'), link.getAttribute('href')],
    );

  beforeEach(() => {
    document.head
      .querySelectorAll(
        'link[rel="canonical"], link[rel="alternate"], meta[name], meta[property]',
      )
      .forEach((element) => element.remove());

    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: '**', children: [] }])],
    });
    service = TestBed.inject(SeoService);
  });

  it('sets the description and the social tags from the page title', () => {
    TestBed.inject(Title).setTitle('Galerie - Imalo Afterschool Germana Sibiu');
    service.updateMetaTags({
      description: 'Galeria Imalo Education.',
      path: '/gallery',
    });

    expect(metaContent('name="description"')).toBe('Galeria Imalo Education.');
    expect(metaContent('property="og:title"')).toBe(
      'Galerie - Imalo Afterschool Germana Sibiu',
    );
    expect(metaContent('property="og:description"')).toBe(
      'Galeria Imalo Education.',
    );
    expect(metaContent('property="og:url"')).toBe(`${SITE_URL}/gallery`);
    expect(metaContent('name="twitter:url"')).toBe(`${SITE_URL}/gallery`);
  });

  it('lets search engines index pages unless told otherwise', () => {
    service.updateMetaTags({ description: 'Acasă', path: '/' });
    expect(metaContent('name="robots"')).toContain('index, follow');

    service.updateMetaTags({
      description: '404',
      path: '/404',
      robots: 'noindex, follow',
    });
    expect(metaContent('name="robots"')).toBe('noindex, follow');
  });

  it('uses the locale and canonical URL of the current language', async () => {
    service.updateMetaTags({ description: 'Oferte', path: '/offers' });
    expect(metaContent('property="og:locale"')).toBe('ro_RO');
    expect(canonicalLinks()[0].getAttribute('href')).toBe(`${SITE_URL}/offers`);

    await TestBed.inject(Router).navigateByUrl('/de/offers');
    service.updateMetaTags({ description: 'Angebote', path: '/offers' });
    expect(metaContent('property="og:locale"')).toBe('de_DE');
    expect(canonicalLinks()[0].getAttribute('href')).toBe(
      `${SITE_URL}/de/offers`,
    );
  });

  it('links both language versions of a page, and drops the links for single-language pages', () => {
    service.updateMetaTags({ description: 'Oferte', path: '/offers' });
    expect(alternateLinks()).toEqual([
      ['ro', `${SITE_URL}/offers`],
      ['de', `${SITE_URL}/de/offers`],
      ['x-default', `${SITE_URL}/offers`],
    ]);

    service.updateMetaTags({
      description: 'Confidențialitate',
      path: '/privacy',
      hasGermanVersion: false,
    });
    expect(alternateLinks()).toEqual([]);
  });

  it('reuses one canonical link and drops the trailing slash for the home page', () => {
    service.updateMetaTags({ description: 'Oferte', path: '/offers' });
    service.updateMetaTags({ description: 'Acasă', path: '/' });

    expect(canonicalLinks().length).toBe(1);
    expect(canonicalLinks()[0].getAttribute('href')).toBe(SITE_URL);
  });
});
