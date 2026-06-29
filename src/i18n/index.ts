import en from './locales/en';
import es from './locales/es';

export const locales = {
  es,
  en,
} as const;

export type Locale = keyof typeof locales;

export const defaultLocale: Locale = 'es';

export const getTranslations = (locale: Locale) => locales[locale];

export const isValidLocale = (locale: string): locale is Locale =>
  locale in locales;
