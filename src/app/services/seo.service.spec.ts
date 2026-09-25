import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { SeoService, SITE_URL } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;

  const metaContent = (selector: string) =>
    document.head.querySelector(`meta[${selector}]`)?.getAttribute('content');
  const canonicalLinks = () =>
    document.head.querySelectorAll('link[rel="canonical"]');

  beforeEach(() => {
    document.head
      .querySelectorAll('link[rel="canonical"], meta[name], meta[property]')
      .forEach((element) => element.remove());

    TestBed.configureTestingModule({});
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

  it('uses the Romanian locale unless given another one', () => {
    service.updateMetaTags({ description: 'Acasă', path: '/' });
    expect(metaContent('property="og:locale"')).toBe('ro_RO');

    service.updateMetaTags({
      description: 'Start',
      path: '/',
      locale: 'de_DE',
    });
    expect(metaContent('property="og:locale"')).toBe('de_DE');
  });

  it('reuses one canonical link and drops the trailing slash for the home page', () => {
    service.updateMetaTags({ description: 'Oferte', path: '/offers' });
    service.updateMetaTags({ description: 'Acasă', path: '/' });

    expect(canonicalLinks().length).toBe(1);
    expect(canonicalLinks()[0].getAttribute('href')).toBe(SITE_URL);
  });
});
