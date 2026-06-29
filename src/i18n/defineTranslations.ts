import { translationsSchema } from './schema';

export const defineTranslations = (translations: unknown) =>
  translationsSchema.parse(translations);
