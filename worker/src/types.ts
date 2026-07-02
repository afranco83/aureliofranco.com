export type Env = {
  SEND_EMAIL: SendEmail;
  TURNSTILE_SECRET_KEY: string;
  CONTACT_DESTINATION_EMAIL: string;
};

export type ContactPayload = {
  fullName: string;
  email: string;
  message: string;
  turnstileToken: string;
  company?: string;
};
