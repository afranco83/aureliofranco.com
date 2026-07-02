import { EmailMessage } from 'cloudflare:email';
import { createMimeMessage } from 'mimetext';
import type { ContactPayload, Env } from './types';

// "from" es la dirección pública del dominio (alias con regla de
// enrutamiento ya configurada en Cloudflare) — nunca viene del payload del
// formulario, así el Worker no puede usarse para enviar desde direcciones
// arbitrarias.
const FROM_ADDRESS = 'info@aureliofranco.com';

export const sendContactEmail = async (env: Env, payload: ContactPayload): Promise<void> => {
  const msg = createMimeMessage();
  msg.setSender({ addr: FROM_ADDRESS, name: 'Formulario web' });
  msg.setRecipient(env.CONTACT_DESTINATION_EMAIL);
  msg.setSubject(`Nuevo mensaje de contacto — ${payload.fullName}`);
  msg.addMessage({
    contentType: 'text/plain',
    data: `Nombre: ${payload.fullName}\nEmail: ${payload.email}\n\n${payload.message}`,
  });

  const message = new EmailMessage(FROM_ADDRESS, env.CONTACT_DESTINATION_EMAIL, msg.asRaw());
  await env.SEND_EMAIL.send(message);
};
