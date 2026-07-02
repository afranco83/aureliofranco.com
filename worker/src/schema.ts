import { z } from 'zod';

// Los límites deben coincidir con los minlength/maxlength del formulario en
// src/components/sections/ContactModal.astro — el cliente es solo UX, esta
// validación es la que realmente decide qué se acepta.
export const contactPayloadSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(320),
  message: z.string().trim().min(10).max(2000),
  turnstileToken: z.string().min(1),
  company: z.string().max(0).optional(),
});
