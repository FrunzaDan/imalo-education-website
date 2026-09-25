import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  LanguageService,
  toGermanPath,
  toRomanianPath,
} from './language.service';

describe('LanguageService', () => {
  let service: LanguageService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: '**', children: [] }])],
    });
    service = TestBed.inject(LanguageService);
    router = TestBed.inject(Router);
  });

  it('defaults to Romanian', () => {
    expect(service.language()).toBe(true);
  });

  it('follows the language of the URL', async () => {
    await router.navigateByUrl('/de/offers');
    expect(service.language()).toBe(false);

    await router.navigateByUrl('/offers');
    expect(service.language()).toBe(true);

    await router.navigateByUrl('/delivery');
    expect(service.language()).toBe(true);
  });

  it('localizes Romanian paths for the current language', async () => {
    expect(service.localize('/offers')).toBe('/offers');

    await router.navigateByUrl('/de');
    expect(service.localize('/offers')).toBe('/de/offers');
    expect(service.localize('/')).toBe('/de');
  });

  it('opens the same page in the other language', async () => {
    await router.navigateByUrl('/gallery');

    await service.toggleLanguage();
    expect(router.url).toBe('/de/gallery');

    await service.toggleLanguage();
    expect(router.url).toBe('/gallery');
  });

  it('opens the German home page from a page with no German version', async () => {
    await router.navigateByUrl('/privacy');

    await service.toggleLanguage();
    expect(router.url).toBe('/de');
  });

  it('keeps the lang attribute of the page in sync', async () => {
    const html = TestBed.inject(DOCUMENT).documentElement;

    TestBed.tick();
    expect(html.lang).toBe('ro');

    await router.navigateByUrl('/de/contact');
    TestBed.tick();
    expect(html.lang).toBe('de');
  });
});

describe('language paths', () => {
  it('converts between the Romanian and German paths', () => {
    expect(toGermanPath('/')).toBe('/de');
    expect(toGermanPath('/offers')).toBe('/de/offers');
    expect(toRomanianPath('/de')).toBe('/');
    expect(toRomanianPath('/de/offers?x=1#top')).toBe('/offers');
    expect(toRomanianPath('/offers')).toBe('/offers');
    expect(toRomanianPath('/delivery')).toBe('/delivery');
  });
});
