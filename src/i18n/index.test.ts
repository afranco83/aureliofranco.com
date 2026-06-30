import { defaultLocale, getTranslations, isValidLocale, locales } from '@/i18n/index';

describe('isValidLocale', () => {
  it('should return true for "es"', () => {
    expect(isValidLocale('es')).toBe(true);
  });

  it('should return true for "en"', () => {
    expect(isValidLocale('en')).toBe(true);
  });

  it('should return false for an unknown locale', () => {
    expect(isValidLocale('fr')).toBe(false);
  });

  it('should return false for an empty string', () => {
    expect(isValidLocale('')).toBe(false);
  });
});

describe('getTranslations', () => {
  it('should return the translations object for "es"', () => {
    expect(getTranslations('es')).toBe(locales.es);
  });

  it('should return the translations object for "en"', () => {
    expect(getTranslations('en')).toBe(locales.en);
  });
});

describe('defaultLocale', () => {
  it('should be "es"', () => {
    expect(defaultLocale).toBe('es');
  });
});
