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

const navItemSchema = z.object({
  href: text.startsWith('#'),
  label: text,
});

const contactFieldSchema = z.object({
  label: text,
  placeholder: text.optional(),
});

const contactFormSchema = z.object({
  title: text,
  description: text,
  closeLabel: text,
  fields: z.object({
    fullName: contactFieldSchema,
    email: contactFieldSchema,
    message: contactFieldSchema,
  }),
  submitLabel: text,
  status: z.object({
    sending: text,
    success: text,
    error: text,
  }),
});

export const translationsSchema = z.object({
  meta: z.object({
    title: text,
    description: text,
  }),
  nav: z.object({
    menuLabel: text,
    items: z.array(navItemSchema).min(1),
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
  claim: textBlockSchema,
  social: z.object({
    label: text,
    title: text,
    description: text,
    email: z.object({
      label: text,
      href: text,
    }),
    items: z.array(socialItemSchema).min(1),
    madeWith: text,
    madeBy: text,
    contactForm: contactFormSchema,
  }),
});

export type Translations = z.infer<typeof translationsSchema>;
