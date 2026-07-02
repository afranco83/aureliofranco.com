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
  msg.setSender({ addr: FROM_ADDRESS, name: 'aureliofranco.com' });
  msg.setRecipient(env.CONTACT_DESTINATION_EMAIL);
  // Permite responder directamente a quien escribió el mensaje desde el
  // cliente de correo, sin tener que copiar el email a mano.
  msg.setHeader('Reply-To', payload.email);
  msg.setSubject(`Nuevo mensaje de ${payload.fullName} desde aureliofranco.com`);
  msg.addMessage({
    contentType: 'text/plain',
    data: [
      'Has recibido un nuevo mensaje a través del formulario de contacto de aureliofranco.com.',
      '',
      `De: ${payload.fullName} <${payload.email}>`,
      '',
      payload.message,
    ].join('\n'),
  });

  const message = new EmailMessage(FROM_ADDRESS, env.CONTACT_DESTINATION_EMAIL, msg.asRaw());
  await env.SEND_EMAIL.send(message);
};
