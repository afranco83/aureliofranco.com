export const ICON_NAMES = [
  'AIBox',
  'Ai',
  'ChartLight',
  'Chemistry',
  'Code',
  'Github',
  'Glass',
  'Lamp',
  'LaptopDuotone',
  'LeaderDuotone',
  'Linkedin',
  'Message',
  'Structure',
  'Whatsapp',
] as const;

export type IconName = (typeof ICON_NAMES)[number];
