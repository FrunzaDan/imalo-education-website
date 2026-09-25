import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { LanguageService } from './language.service';

describe('LanguageService', () => {
  let service: LanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguageService);
  });

  it('defaults to Romanian', () => {
    expect(service.language()).toBe(true);
  });

  it('flips on every call to toggleLanguage', () => {
    service.toggleLanguage();
    expect(service.language()).toBe(false);

    service.toggleLanguage();
    expect(service.language()).toBe(true);
  });

  it('shares one signal instance across injections, since it is providedIn root', () => {
    const other = TestBed.inject(LanguageService);

    expect(other.language()).toBe(service.language());
    other.toggleLanguage();
    expect(service.language()).toBe(false);
  });

  it('keeps the lang attribute of the page in sync', () => {
    const html = TestBed.inject(DOCUMENT).documentElement;

    TestBed.tick();
    expect(html.lang).toBe('ro');

    service.toggleLanguage();
    TestBed.tick();
    expect(html.lang).toBe('de');
  });
});
