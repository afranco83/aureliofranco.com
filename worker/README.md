# Worker de contacto

Procesa el envío del formulario de contacto del footer (`/api/contact`) sin depender de un backend de terceros. Vive fuera del workspace pnpm de la raíz — se instala y despliega de forma independiente al build de Astro.

## Setup inicial (una sola vez)

1. **Turnstile**: crear un widget en el dashboard de Cloudflare (Turnstile → Add site, modo "Managed") para `aureliofranco.com`. Copiar el **sitekey** en `src/components/sections/ContactModal.astro` (constante `TURNSTILE_SITE_KEY`). El **secret key** no se pega en ningún archivo: ver paso 4.
2. **Email Routing**: ya activado — `info@aureliofranco.com` reenvía a la bandeja real verificada. El Worker envía "from" `info@aureliofranco.com` (hardcodeado en `src/email.ts`, es la dirección pública) y "to" la bandeja real, que **nunca se escribe en ningún archivo del repo** — vive solo como secret `CONTACT_DESTINATION_EMAIL` (ver paso 4). El binding `send_email` en `wrangler.jsonc` no declara `destination_address`: sin esa restricción explícita, Cloudflare solo permite enviar a destinos ya verificados en la cuenta, que es exactamente esa única bandeja. **Importante**: confirmar en el dashboard que el envío vía binding `send_email` está disponible/estable para la cuenta (era beta pública a mediados de 2026). Si no lo está, sustituir solo `src/email.ts` por una API transaccional de terceros (p.ej. Resend) sin tocar el resto del Worker.
3. **Cloudflare API Token**: crear uno con permiso "Edit Workers" scoped a la zona `aureliofranco.com`, añadirlo como secret `CLOUDFLARE_API_TOKEN` en GitHub (Settings → Secrets and variables → Actions) para el workflow de despliegue automático.
4. **Secrets del Worker** (ninguno se escribe en archivos del repo):
   ```bash
   cd worker
   wrangler login
   wrangler secret put TURNSTILE_SECRET_KEY
   wrangler secret put CONTACT_DESTINATION_EMAIL
   ```
5. **Primer deploy manual** (confirma que la Route se asocia bien a la zona antes de confiar en el workflow automático):
   ```bash
   wrangler deploy
   ```

## Desarrollo local

```bash
pnpm install
pnpm dev
```

Para probar en local con secrets reales, crear `worker/.dev.vars` (gitignored, nunca se commitea):

```
TURNSTILE_SECRET_KEY=...
CONTACT_DESTINATION_EMAIL=...
```

`wrangler dev` simula el binding `send_email` de forma limitada — el envío real de emails puede requerir `wrangler dev --remote`. Verificar el comportamiento al probar.

Prueba manual con `curl` (usar los sitekey/secret de **test** de Turnstile — siempre pasan/fallan, no gastan intentos reales):

```bash
curl -X POST http://localhost:8787 \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","email":"test@example.com","message":"Mensaje de prueba con mas de diez caracteres","turnstileToken":"XXXX.DUMMY.TOKEN"}'
```

Casos a comprobar: payload válido (200), campo faltante (400), email inválido (400), honeypot (`company`) relleno (200 sin enviar email), Turnstile inválido (403), método GET (405).

## Despliegue

Automático vía `.github/workflows/deploy-worker.yml` en cada push a `main` que toque `worker/**`. Manual: `pnpm deploy` desde esta carpeta.
