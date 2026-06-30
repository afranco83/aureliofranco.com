# aureliofranco.com

Sitio web personal de **Aurelio Franco**, Frontend Developer. Landing de una sola página (one-pager) que presenta su perfil profesional, forma de trabajo y stack tecnológico.

🔗 Construido con [Astro](https://astro.build) + [React](https://react.dev) + [Tailwind CSS v4](https://tailwindcss.com).

## 🚀 Stack técnico

| Categoría              | Tecnología                                                             |
| ---------------------- | ---------------------------------------------------------------------- |
| Framework              | Astro 6 (SSG, islas con `@astrojs/react`)                              |
| UI interactiva         | React 19                                                               |
| Estilos                | Tailwind CSS v4 (vía plugin de Vite)                                   |
| Utilidades             | `tailwind-merge` para composición de clases                            |
| i18n / Validación      | Zod (schema de traducciones validado en build time)                    |
| Imágenes               | `sharp` (optimización vía `astro:assets`)                              |
| Tipado                 | TypeScript (`astro check`)                                             |
| Tests                  | Vitest (suites unitarias para el sistema i18n)                         |
| Lint / Format          | ESLint 10 + `eslint-plugin-astro`, Prettier                            |
| Convenciones de commit | Commitlint + `cz-git` + Husky (hooks `commit-msg` / `pre-commit`)      |
| CI / CD                | GitHub Actions (CI: `lint` → `typecheck` → `test` → `build`; deploy automático a GitHub Pages) |
| Gestor de paquetes     | pnpm (workspace)                                                       |

## 📁 Estructura del proyecto

```
.
├── public/                    # Estáticos servidos tal cual (favicon, icons.svg generado, og-image-*.png)
├── src/
│   ├── assets/images/         # Imágenes optimizables por Astro (hero)
│   ├── components/
│   │   ├── Navbar.astro       # Selector de idioma (ES / EN) con comportamiento de scroll
│   │   ├── sections/          # Bloques de la página: Hero, About, FeaturedClaim, Howto, Stack, Claim, Social
│   │   └── ui/                # Componentes reutilizables: Container, Heading, Icon, IconCard, Claim
│   ├── data/                  # Ficheros stub vacíos (el contenido vive en src/i18n/locales/)
│   ├── i18n/
│   │   ├── locales/           # Traducciones por idioma: en.ts, es.ts
│   │   ├── schema.ts          # Schema Zod con la forma de todas las traducciones
│   │   ├── defineTranslations.ts  # Helper que valida locales contra el schema en build time
│   │   └── index.ts           # getTranslations(locale), isValidLocale(), defaultLocale
│   ├── icons/                 # SVGs fuente (origen del sprite, normalmente exportados de Figma)
│   ├── layouts/
│   │   └── BaseLayout.astro   # Layout base: <head>, meta SEO/OG, JSON-LD, Navbar
│   ├── pages/
│   │   ├── index.astro        # Página principal (es)
│   │   ├── en/index.astro     # Página principal (en)
│   │   └── playground.astro   # Página de design system para validar tokens visuales
│   ├── styles/global.css      # Tema Tailwind v4 (`@theme`): tipografía, color, radios
│   └── types/icons.ts         # Tipo `IconName` e `ICON_NAMES`, generados automáticamente
├── build-sprite.mjs           # Script que genera public/icons.svg + src/types/icons.ts
├── astro.config.mjs           # Integraciones (react, tailwind, sitemap) y alias `@` → `src/`
└── .github/
    ├── workflows/ci.yml       # Lint, typecheck, test y build en cada PR y push a main
    └── workflows/deploy.yml   # Deploy automático a GitHub Pages en cada push a main
```

## 🧩 Cómo funciona el sistema de iconos

Los SVGs se colocan en `src/icons/`. El script `build-sprite.mjs`:

1. Lee cada SVG, normaliza su `viewBox` y fuerza `fill`/`stroke` a `currentColor` (para que hereden color por CSS).
2. Genera un sprite único en `public/icons.svg` (cada icono como `<symbol>`).
3. Regenera `src/types/icons.ts` con el tipo `IconName`, usado por el componente `Icon.astro` para autocompletado y type-safety.

Se ejecuta automáticamente antes de `dev` y `build` (`predev` / `prebuild`), o manualmente con:

```sh
pnpm build-icons
```

> ⚠️ No edites `src/types/icons.ts` a mano: se sobrescribe en cada generación del sprite.

## 🧞 Comandos

| Comando            | Acción                                                               |
| ------------------ | -------------------------------------------------------------------- |
| `pnpm install`     | Instala dependencias                                                 |
| `pnpm dev`         | Servidor local en `localhost:4321`                                   |
| `pnpm build`       | Build de producción a `./dist/`                                      |
| `pnpm preview`     | Previsualiza el build localmente                                     |
| `pnpm lint`        | Linting con ESLint                                                   |
| `pnpm format`      | Formatea con Prettier                                                |
| `pnpm typecheck`   | Comprueba tipos con `astro check`                                    |
| `pnpm test`        | Ejecuta los tests unitarios con Vitest                               |
| `pnpm build-icons` | Regenera el sprite de iconos y `IconName`                            |
| `pnpm commit`      | Commit guiado (Commitizen / `cz-git`) siguiendo Conventional Commits |

## ✅ Calidad y convenciones

- **Conventional Commits**, validados por `commitlint` en el hook `commit-msg` de Husky.
- **Pre-commit**: lint/format antes de cada commit (Husky).
- **CI** (GitHub Actions, en cada PR y push a `main`): `pnpm lint` → `pnpm typecheck` → `pnpm test` → `pnpm build`.
- **CD** (GitHub Actions, en cada push a `main`): build y deploy automático a GitHub Pages.
- Flujo de trabajo basado en ramas por feature (`feature/...`, `refactor/...`, `style/...`) integradas vía PR a `main`.

## 🌐 Internacionalización (i18n)

El sitio está disponible en español (`/`) e inglés (`/en/`). El sistema funciona así:

1. Las traducciones se definen en `src/i18n/locales/es.ts` y `src/i18n/locales/en.ts` usando `defineTranslations()`, que valida el objeto contra el schema Zod en build time.
2. El schema (`src/i18n/schema.ts`) es la fuente de verdad de la forma de todas las traducciones.
3. Cada página llama a `getTranslations(locale)` y pasa los slices correspondientes a cada sección como prop `t`.
4. Los componentes de sección nunca llaman a `getTranslations()` directamente — solo reciben `t`.

> Toda traducción nueva debe añadirse en **ambos** locales y en el **schema** en el mismo commit.

## 📝 Estado actual

- Página principal (ES y EN) compuesta por: `Hero` → `About` → `FeaturedClaim` → `Howto` → `Stack` → `Claim` → `Social` (footer).
- El `Navbar` fijo en la parte superior permite cambiar entre ES y EN; adapta colores al hacer scroll.
- Los ficheros en `src/data/` (`about.ts`, `hero.ts`, `howto.ts`, `social.ts`, `stack.ts`) existen pero están **vacíos**: todo el contenido de las secciones vive en `src/i18n/locales/`.
- `playground.astro` es una página de design system viva (no enlazada desde la navegación) para validar tokens de color, tipografía, botones y cards definidos en `global.css`.
- El `BaseLayout` incluye meta tags SEO completos (canonical, hreflang, Open Graph, Twitter Card, JSON-LD Schema.org).

## 📦 Despliegue

El sitio se despliega automáticamente en **GitHub Pages** en `https://www.aureliofranco.com` con cada push a `main`.

El workflow `.github/workflows/deploy.yml` ejecuta `pnpm build` y publica el contenido de `dist/` mediante `actions/deploy-pages`. El dominio personalizado se gestiona a través de `public/CNAME`.

Para desarrollo local, `pnpm build` genera el sitio estático en `dist/`, previsualizable con `pnpm preview`.

## 📄 Licencia

Ver [`LICENSE.md`](./LICENSE.md).
