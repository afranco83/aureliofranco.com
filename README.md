# aureliofranco.com

Sitio web personal de **Aurelio Franco**, Frontend Developer. Landing de una sola página (one-pager) que presenta su perfil profesional, forma de trabajo y stack tecnológico.

🔗 Construido con [Astro](https://astro.build) + [React](https://react.dev) + [Tailwind CSS v4](https://tailwindcss.com).

## 🚀 Stack técnico

| Categoría              | Tecnología                                                        |
| ---------------------- | ----------------------------------------------------------------- |
| Framework              | Astro 6 (SSG, islas con `@astrojs/react`)                         |
| UI interactiva         | React 19                                                          |
| Estilos                | Tailwind CSS v4 (vía plugin de Vite)                              |
| Utilidades             | `tailwind-merge` para composición de clases                       |
| Imágenes               | `sharp` (optimización vía `astro:assets`)                         |
| Tipado                 | TypeScript (`astro check`)                                        |
| Lint / Format          | ESLint 10 + `eslint-plugin-astro`, Prettier                       |
| Convenciones de commit | Commitlint + `cz-git` + Husky (hooks `commit-msg` / `pre-commit`) |
| CI                     | GitHub Actions (`lint` → `typecheck` → `build`)                   |
| Gestor de paquetes     | pnpm (workspace)                                                  |

## 📁 Estructura del proyecto

```
.
├── public/                 # Estáticos servidos tal cual (favicon, icons.svg generado)
├── src/
│   ├── assets/images/      # Imágenes optimizables por Astro (hero)
│   ├── components/
│   │   ├── sections/        # Bloques de la página: Hero, About, Stack, Howto, Claim, FeaturedClaim, Social
│   │   └── ui/                # Componentes reutilizables: Container, Heading, Icon, IconCard, Claim
│   ├── data/                  # Ficheros de datos por sección (about, hero, howto, social, stack)
│   ├── icons/                  # SVGs fuente (origen del sprite, normalmente exportados de Figma)
│   ├── layouts/
│   │   └── BaseLayout.astro    # Layout base: <head>, meta, import de estilos globales
│   ├── pages/
│   │   ├── index.astro         # Página principal (composición de secciones)
│   │   └── playground.astro    # Página de prueba para validar tokens visuales (colores, tipografía, botones, cards)
│   ├── styles/global.css       # Tema Tailwind v4 (`@theme`): tipografía, color, radios
│   └── types/icons.ts          # Tipo `IconName`, generado automáticamente
├── build-sprite.mjs          # Script que genera public/icons.svg + src/types/icons.ts a partir de src/icons/*.svg
├── astro.config.mjs          # Integraciones (react, tailwind) y alias `@` → `src/`
└── .github/workflows/ci.yml
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
| `pnpm build-icons` | Regenera el sprite de iconos y `IconName`                            |
| `pnpm commit`      | Commit guiado (Commitizen / `cz-git`) siguiendo Conventional Commits |

## ✅ Calidad y convenciones

- **Conventional Commits**, validados por `commitlint` en el hook `commit-msg` de Husky.
- **Pre-commit**: lint/format antes de cada commit (Husky).
- **CI** (GitHub Actions, en cada PR y push a `main`): `pnpm lint` → `pnpm typecheck` → `pnpm build`.
- Flujo de trabajo basado en ramas por feature (`feature/...`, `refactor/...`, `style/...`) integradas vía PR a `main`.

## 📝 Estado actual

- Página principal compuesta por: `Hero` → `About` → `FeaturedClaim` → `Howto` → `Stack` → `Claim` → `Social`.
- La sección `Social` (`src/components/sections/Social.astro`) es un placeholder pendiente de implementación (solo título, sin contenido ni enlaces).
- Los ficheros en `src/data/` (`about.ts`, `hero.ts`, `howto.ts`, `social.ts`, `stack.ts`) existen pero están **vacíos**: el contenido de cada sección está actualmente hardcodeado dentro del propio componente `.astro` (ver `ITEMS` en `Howto.astro` y `Stack.astro`). Si la intención es centralizar el contenido en `data/`, falta migrar esos arrays y conectarlos.
- `playground.astro` es una página de design system viva (no enlazada desde la navegación) para validar tokens de color, tipografía, botones y cards definidos en `global.css`.

## 📦 Despliegue

Proyecto generado como sitio estático (`astro build` → `dist/`), desplegable en cualquier hosting estático o CDN (Netlify, Vercel, Cloudflare Pages, GitHub Pages, etc.). No hay configuración de adaptador SSR ni variables de entorno detectadas.

## 📄 Licencia

Ver [`LICENSE.md`](./LICENSE.md).
