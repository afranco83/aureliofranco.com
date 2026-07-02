type SiteverifyResponse = {
  success: boolean;
};

export const verifyTurnstile = async (
  token: string,
  secret: string,
  ip: string | null,
): Promise<boolean> => {
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret, response: token, remoteip: ip ?? undefined }),
  });

  if (!response.ok) return false;

  const result = (await response.json()) as SiteverifyResponse;
  return result.success === true;
};
