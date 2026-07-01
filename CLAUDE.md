# aureliofranco.com

Web personal construida con Astro, React, Tailwind CSS v4 y TypeScript.

## Comandos esenciales

```bash
pnpm dev          # servidor de desarrollo (ejecuta build-icons automáticamente)
pnpm build        # build de producción (ejecuta build-icons automáticamente)
pnpm typecheck    # verificación de tipos con astro check
pnpm lint         # ESLint
pnpm format       # Prettier
pnpm commit       # commitizen (usar siempre para commits, ver convención abajo)
pnpm build-icons  # regenerar sprite SVG en public/icons.svg desde src/icons/
```

## Estructura

```
src/
  components/
    sections/   # secciones de la página (Hero, About, Stack…)
    ui/         # componentes reutilizables (Icon, Heading, Container…)
  i18n/
    locales/    # traducciones (en.ts, es.ts) — usar defineTranslations()
    schema.ts   # esquema Zod que define la forma de todas las traducciones
    index.ts    # getTranslations(locale), isValidLocale(), defaultLocale
  icons/        # SVGs fuente; build-icons los combina en un sprite
  layouts/      # BaseLayout.astro
  pages/
    index.astro      # página principal (es)
    en/index.astro   # página principal (en)
  types/
    icons.ts    # tipo IconName e ICON_NAMES (generado por build-icons)
```

## TypeScript

El proyecto usa `astro/tsconfigs/strict`. No añadir `any` ni aserciones `!` sin justificación explícita.

**Tipos vs interfaces**
Usar siempre `type` para Props y tipos locales. La única excepción válida es cuando un componente necesita extender atributos HTML nativos:

```ts
// correcto — type para Props simples
type Props = { title: string; className?: string };

// correcto — interface cuando se extiende HTMLAttributes
interface Props extends HTMLAttributes<'div'> { className?: string }

// incorrecto — interface sin necesidad de extensión
interface Props { title: string }
```

**Imports**
Usar siempre el alias `@/` en lugar de rutas relativas. Orden: tipos (`import type`) antes que valores, librería antes que proyecto.

```ts
// correcto
import type { Translations } from '@/i18n/schema.ts';
import Container from '@/components/ui/Container.astro';

// incorrecto
import type { IconName } from '../../types/icons.ts';
```

## Componentes

**Astro vs React**
Por defecto, todo componente es `.astro`. React solo cuando se necesita estado o interactividad real en el cliente. Evitar directivas `client:*` salvo que sea imprescindible — cada una rompe el modelo de cero JS.

**Props de traducción**
Los componentes de sección reciben su slice de `Translations` como prop `t`. Nunca llaman a `getTranslations()` internamente.

```ts
// en la sección
type Props = { t: Translations['stack'] };

// en la página — único sitio donde se llama a getTranslations()
const t = getTranslations('es');
<Stack t={t.stack} />
```

**Clases condicionales**
Regla: `class:list` para condiciones estructurales del propio componente; `twMerge` cuando se recibe un `className` externo que puede sobreescribir defaults.

```astro
<!-- class:list para condiciones internas -->
<div class:list={['flex gap-4', { 'flex-col': variant === 'stacked' }]}>

<!-- twMerge para fusionar con overrides externos -->
<h2 class={twMerge('text-5xl font-black', titleClassName)}>

<!-- no mezclar ambos en el mismo elemento -->
```

**HTML en componentes**
`set:html` solo para strings de i18n internos que contienen marcado (`<p>`, `<strong>`, `<a>`). Nunca para contenido externo o generado por el usuario.

```astro
<!-- correcto — string de i18n de confianza -->
<Fragment set:html={paragraph} />

<!-- correcto — descripción del componente ui/ que puede tener markup -->
<div set:html={description} />
```

## i18n

- Idioma por defecto: `es`. El inglés vive en `src/pages/en/`.
- Toda traducción nueva va en **ambos** locales y en el **schema Zod** en el mismo commit.
- Usar `defineTranslations()` al definir traducciones — valida contra el schema en build time.
- El HTML dentro de las traducciones se limita a `<p>`, `<strong>` y `<a>`. Sin clases de Tailwind ni lógica dentro del HTML de las traducciones.

## Iconos

- Añadir el SVG a `src/icons/` y ejecutar `pnpm build-icons` para regenerar el sprite y el tipo `IconName`.
- Usar siempre `<Icon name="…" size="md" />`. Sin SVG inline.
- Iconos decorativos llevan `aria-hidden="true"` (el componente lo aplica automáticamente cuando no se pasa `title`).

## Estilos

Tailwind CSS v4 vía `@tailwindcss/vite`. Sin archivo de configuración separado — los tokens se definen en CSS.

- Clases de layout y tipografía base en el propio componente; overrides via prop `className` fusionado con `twMerge`.
- No añadir estilos globales en `global.css` salvo que sea imposible hacerlo con Tailwind.

## Animaciones

Scroll-reveal con [Motion](https://motion.dev) (API vanilla, sin React ni `client:*`).

- Para revelar un elemento al hacer scroll: añadir el atributo `data-reveal` y fusionar `REVEAL_CLASSES` (de `@/styles/reveal.ts`) en su `class`. `src/scripts/reveal.ts` (cargado globalmente en `BaseLayout`) usa `inView` para marcarlo `data-visible="true"`.
- `data-reveal-stagger` en el contenedor escalona sus hijos directos vía `--stagger-index` (estilo inline) — es la única pieza de CSS global del sistema (`global.css`), porque Tailwind escanea clases de forma estática y no puede generar una utilidad `delay-*` para un valor calculado en runtime.
- Progressive enhancement obligatorio: el contenido nunca se oculta salvo que `<html>` tenga la clase `js-reveal` (añadida por un script inline síncrono en `BaseLayout`, nunca condicionada a que el resto del JS cargue bien). Sin JS, o si el bundle falla, el contenido debe seguir siendo visible — nunca `display:none`/`visibility:hidden` sobre contenido real.
- Toda cadena de animaciones que controle si algo se vuelve visible necesita un `.catch()`/fallback: si la promesa se rechaza, el contenido no puede quedar oculto para siempre.
- Scripts específicos de una sección (como `curtains.ts` del Hero) se cargan con un `<script>` en el propio componente, no en `BaseLayout` — así páginas que no usan esa sección no cargan ni ejecutan su lógica.
- **Tailwind v4 anima `translate`/`scale`/`rotate`, no `transform`**: las utilidades `translate-x-*`/`translate-y-*` fijan la propiedad CSS `translate`, así que una transición debe declararse como `transition-[opacity,translate]` (no `transition-[opacity,transform]`) o el movimiento no se anima, solo el fade.
- Motion en `animate()` usa la clave `ease` (no `easing`) con nombres en camelCase (`easeOut`, `easeInOut`). Si se pasan las opciones como variable (no como literal inline), TypeScript no avisa de una clave inválida — verificar el bundle compilado si hay dudas.
- Respetar siempre `prefers-reduced-motion: reduce`.

## Performance

- **Scroll listeners**: siempre con `{ passive: true }`.
- **Imágenes**: `loading="lazy"` en imágenes fuera del viewport inicial; la imagen hero no lleva lazy.
- El build de Astro produce cero JS de cliente por defecto. No añadir `client:*` sin necesidad real.

## Accesibilidad

- Cada sección lleva `<section id="...">` con un identificador semántico.
- El atributo `lang` del `<html>` siempre refleja el locale activo — se gestiona via `BaseLayout`.
- Componentes interactivos necesitan foco visible y roles ARIA correctos.

## Commits

Conventional Commits enforced por commitlint + commitizen. Usar `pnpm commit`.

Tipos válidos: `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`, `perf`, `ci`.

```
feat(i18n): add French locale
fix(icons): regenerate sprite after adding new SVG
refactor(layout): simplify BaseLayout props
```
