type SiteverifyResponse = {
  success: boolean;
  'error-codes'?: string[];
};

const SITEVERIFY_TIMEOUT_MS = 5000;

export type TurnstileResult = { success: true } | { success: false; expired: boolean };

export const verifyTurnstile = async (
  token: string,
  secret: string,
  ip: string | null,
): Promise<TurnstileResult> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SITEVERIFY_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token, remoteip: ip ?? undefined }),
      signal: controller.signal,
    });
  } catch (error) {
    console.error('turnstile siteverify request failed', error);
    return { success: false, expired: false };
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    console.error('turnstile siteverify http error', response.status);
    return { success: false, expired: false };
  }

  const result = (await response.json()) as SiteverifyResponse;
  if (result.success) return { success: true };

  const errorCodes = result['error-codes'] ?? [];
  console.error('turnstile verification failed', errorCodes);
  return { success: false, expired: errorCodes.includes('timeout-or-duplicate') };
};
