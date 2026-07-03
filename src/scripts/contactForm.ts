const TURNSTILE_SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js';

const trigger = document.querySelector<HTMLAnchorElement>('[data-contact-trigger]');
const dialog = document.querySelector<HTMLDialogElement>('#contact-dialog');
const form = dialog?.querySelector<HTMLFormElement>('[data-contact-form]');
const closeButton = dialog?.querySelector<HTMLButtonElement>('[data-modal-close]');
const statusEl = form?.querySelector<HTMLElement>('[data-form-status]');
const submitButton = form?.querySelector<HTMLButtonElement>('[data-submit-button]');
const turnstileContainer = form?.querySelector<HTMLElement>('#contact-turnstile');

if (trigger && dialog && form && closeButton && statusEl && submitButton && turnstileContainer) {
  let turnstileWidgetId: string | undefined;
  let turnstileToken: string | undefined;
  let turnstileLoadPromise: Promise<void> | undefined;

  // El botón solo se habilita cuando la verificación anti-spam se ha
  // completado Y los campos cumplen las restricciones nativas del
  // formulario (required/minlength/maxlength/type=email).
  const updateSubmitState = () => {
    submitButton.disabled = !turnstileToken || !form.checkValidity();
  };

  form.addEventListener('input', updateSubmitState);

  const loadTurnstile = (): Promise<void> => {
    if (window.turnstile) return Promise.resolve();

    turnstileLoadPromise ??= new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = TURNSTILE_SCRIPT_URL;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => {
        // Sin esto, un fallo puntual de carga (adblock, extensión de
        // privacidad, red) deja la promesa cacheada en rechazado para
        // siempre: reabrir el modal nunca reintentaría la carga del script.
        script.remove();
        turnstileLoadPromise = undefined;
        reject(new Error('turnstile_load_failed'));
      };
      document.head.appendChild(script);
    });

    return turnstileLoadPromise;
  };

  const renderTurnstile = async () => {
    // Ya renderizado en una apertura anterior del modal: no tocar el
    // contenedor, o borraríamos el iframe del widget ya funcional.
    if (turnstileWidgetId !== undefined) return;

    turnstileContainer.textContent = turnstileContainer.dataset.loadingLabel ?? '';

    try {
      await loadTurnstile();
      if (window.turnstile && turnstileWidgetId === undefined) {
        turnstileContainer.textContent = '';
        turnstileWidgetId = window.turnstile.render(turnstileContainer, {
          sitekey: turnstileContainer.dataset.sitekey ?? '',
          callback: (token) => {
            turnstileToken = token;
            updateSubmitState();
          },
          'error-callback': () => {
            turnstileToken = undefined;
            updateSubmitState();
          },
          'expired-callback': () => {
            turnstileToken = undefined;
            updateSubmitState();
          },
        });
      }
    } catch {
      turnstileContainer.textContent = '';
      setStatus(statusEl.dataset.statusWidgetBlocked, 'error');
    }
  };

  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    dialog.showModal();
    void renderTurnstile();
  });

  closeButton.addEventListener('click', () => {
    dialog.close();
  });

  // El <dialog> nativo no cierra al hacer click en el backdrop por sí solo:
  // solo lo hace si el click "aterriza" en el propio elemento (fuera del
  // contenido, que no ocupa todo su área con showModal()).
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  const STATUS_COLOR_CLASSES = ['text-subtle', 'text-green-600', 'text-red-600'];

  const setStatus = (message: string | undefined, variant: 'sending' | 'success' | 'error') => {
    statusEl.textContent = message ?? '';
    statusEl.classList.remove(...STATUS_COLOR_CLASSES);
    statusEl.classList.add(
      variant === 'success' ? 'text-green-600' : variant === 'error' ? 'text-red-600' : 'text-subtle',
    );
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    if (String(formData.get('company') ?? '')) return; // honeypot: abortar en silencio

    if (!turnstileToken) {
      setStatus(statusEl.dataset.statusTokenExpired, 'error');
      return;
    }

    submitButton.disabled = true;
    setStatus(statusEl.dataset.statusSending, 'sending');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: String(formData.get('fullName') ?? ''),
          email: String(formData.get('email') ?? ''),
          message: String(formData.get('message') ?? ''),
          turnstileToken,
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setStatus(
          body?.error === 'turnstile_expired'
            ? statusEl.dataset.statusTokenExpired
            : statusEl.dataset.statusServerError,
          'error',
        );
        if (turnstileWidgetId !== undefined) window.turnstile?.reset(turnstileWidgetId);
        turnstileToken = undefined;
        return;
      }

      setStatus(statusEl.dataset.statusSuccess, 'success');
      form.reset();
      if (turnstileWidgetId !== undefined) window.turnstile?.reset(turnstileWidgetId);
      turnstileToken = undefined;
    } catch {
      setStatus(statusEl.dataset.statusServerError, 'error');
      if (turnstileWidgetId !== undefined) window.turnstile?.reset(turnstileWidgetId);
      turnstileToken = undefined;
    } finally {
      updateSubmitState();
    }
  });
}
