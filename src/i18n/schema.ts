import { z } from 'zod';
import { ICON_NAMES } from '../types/icons';

const text = z.string().trim().min(1);

const iconSchema = z.enum(ICON_NAMES);

const textBlockSchema = z.object({
  text,
});

const sectionSchema = z.object({
  title: text,
  description: text,
});

const cardSchema = z.object({
  icon: iconSchema,
  title: text,
  description: text,
});

const cardsSectionSchema = sectionSchema.extend({
  items: z.array(cardSchema).min(1),
});

const socialItemSchema = z.object({
  title: text,
  icon: iconSchema,
  href: text,
});

export const translationsSchema = z.object({
  meta: z.object({
    title: text,
    description: text,
  }),
  hero: z.object({
    title: text,
    subtitle: text,
  }),
  aboutMe: sectionSchema.extend({
    text: z.array(text).min(1),
  }),
  featuredClaim: textBlockSchema,
  howTo: cardsSectionSchema,
  stack: cardsSectionSchema,
  claim: textBlockSchema.extend({ label: text }),
  social: z.object({
    label: text,
    items: z.array(socialItemSchema).min(1),
  }),
});

export type Translations = z.infer<typeof translationsSchema>;
