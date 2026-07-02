import { contactPayloadSchema } from './schema';
import { verifyTurnstile } from './turnstile';
import { sendContactEmail } from './email';
import type { Env } from './types';

const jsonResponse = (body: Record<string, unknown>, status: number): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
      return jsonResponse({ ok: false, error: 'method_not_allowed' }, 405);
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ ok: false, error: 'invalid_json' }, 400);
    }

    const parsed = contactPayloadSchema.safeParse(body);
    if (!parsed.success) {
      return jsonResponse({ ok: false, error: 'validation_error' }, 400);
    }
    const payload = parsed.data;

    if (payload.company) {
      // Honeypot relleno: probablemente un bot. Respondemos como si todo
      // hubiera ido bien para no delatar el mecanismo, sin enviar nada.
      return jsonResponse({ ok: true }, 200);
    }

    const ip = request.headers.get('CF-Connecting-IP');
    const turnstileOk = await verifyTurnstile(payload.turnstileToken, env.TURNSTILE_SECRET_KEY, ip);
    if (!turnstileOk) {
      return jsonResponse({ ok: false, error: 'turnstile_failed' }, 403);
    }

    try {
      await sendContactEmail(env, payload);
    } catch (error) {
      console.error('contact email failed', error);
      return jsonResponse({ ok: false, error: 'email_failed' }, 502);
    }

    return jsonResponse({ ok: true }, 200);
  },
};
