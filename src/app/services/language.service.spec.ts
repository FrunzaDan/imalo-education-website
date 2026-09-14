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
});
