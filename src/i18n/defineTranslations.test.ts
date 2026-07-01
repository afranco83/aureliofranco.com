import { defineTranslations } from '@/i18n/defineTranslations';
import { ICON_NAMES } from '@/types/icons';

const validIcon = ICON_NAMES[0];

const minimalValidTranslations = {
  meta: { title: 'Title', description: 'Description' },
  hero: { title: 'Title', subtitle: 'Subtitle' },
  aboutMe: { title: 'About', description: 'Description', text: ['Paragraph'] },
  featuredClaim: { text: 'Claim' },
  howTo: {
    title: 'How to',
    description: 'Description',
    items: [{ icon: validIcon, title: 'Step', description: 'Description' }],
  },
  stack: {
    title: 'Stack',
    description: 'Description',
    items: [{ icon: validIcon, title: 'Tech', description: 'Description' }],
  },
  claim: { text: 'Claim' },
  social: {
    label: 'Label',
    items: [{ title: 'Social', icon: validIcon, href: 'https://example.com' }],
  },
};

describe('defineTranslations', () => {
  it('should return the translations object when input is valid', () => {
    expect(defineTranslations(minimalValidTranslations)).toEqual(
      minimalValidTranslations,
    );
  });

  it('should throw when a required top-level key is missing', () => {
    const withoutHero = Object.fromEntries(
      Object.entries(minimalValidTranslations).filter(
        ([key]) => key !== 'hero',
      ),
    );
    expect(() => defineTranslations(withoutHero)).toThrow();
  });

  it('should throw when meta is missing', () => {
    const withoutMeta = Object.fromEntries(
      Object.entries(minimalValidTranslations).filter(
        ([key]) => key !== 'meta',
      ),
    );
    expect(() => defineTranslations(withoutMeta)).toThrow();
  });

  it('should throw when meta.title is empty', () => {
    expect(() =>
      defineTranslations({
        ...minimalValidTranslations,
        meta: { ...minimalValidTranslations.meta, title: '' },
      }),
    ).toThrow();
  });

  it('should throw when meta.description is empty', () => {
    expect(() =>
      defineTranslations({
        ...minimalValidTranslations,
        meta: { ...minimalValidTranslations.meta, description: '' },
      }),
    ).toThrow();
  });

  it('should throw when a text field is an empty string', () => {
    expect(() =>
      defineTranslations({
        ...minimalValidTranslations,
        claim: { ...minimalValidTranslations.claim, text: '' },
      }),
    ).toThrow();
  });

  it('should throw when a text field contains only whitespace', () => {
    expect(() =>
      defineTranslations({
        ...minimalValidTranslations,
        claim: { ...minimalValidTranslations.claim, text: '   ' },
      }),
    ).toThrow();
  });

  it('should throw when social.label is missing', () => {
    const socialWithoutLabel = Object.fromEntries(
      Object.entries(minimalValidTranslations.social).filter(
        ([key]) => key !== 'label',
      ),
    );
    expect(() =>
      defineTranslations({
        ...minimalValidTranslations,
        social: socialWithoutLabel,
      }),
    ).toThrow();
  });

  it('should throw when an icon name is not valid', () => {
    expect(() =>
      defineTranslations({
        ...minimalValidTranslations,
        howTo: {
          ...minimalValidTranslations.howTo,
          items: [
            { icon: 'NotAnIcon', title: 'Step', description: 'Description' },
          ],
        },
      }),
    ).toThrow();
  });
});
