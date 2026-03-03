# Gemini CLI Project Context: schachfreunde-biberach.de

This project is a modern homepage and blog for the chess club **Schachfreunde Heilbronn-Biberach 1978 e. V.** It is built using the Nuxt ecosystem with a heavy focus on Nuxt Content and Nuxt UI.

## Project Overview

- **Main Technologies:** Nuxt 4, Nuxt UI v4, Nuxt Content 3, Nuxt Image, Nuxt SEO, Vite PWA.
- **Architecture:** Nuxt 4 `app/` directory structure. Content-driven using Markdown and YAML files.
- **Styling:** Nuxt UI (Tailwind CSS based) with custom theme colors (`verein`, `jugend`, `mannschaft`).
- **Deployment:** Cloudflare Pages via Nitro (preset: `cloudflare_module`).
- **Features:**
  - Blog with categories and authors.
  - Tournament results and Team pages.
  - Interactive Chessboard component (custom logic in `app.config.ts`).
  - PWA support.
  - RSS feed for the blog.
  - SEO optimization via `@nuxtjs/seo`.

## Key Commands

- **Development:** `pnpm dev` - Starts the Nuxt development server.
- **Build:** `pnpm build` - Builds the project for production.
- **Static Generation:** `pnpm generate` - Generates a static version of the site.
- **Preview:** `pnpm preview` - Previews the production build locally.
- **Linting:** `pnpm lint` and `pnpm lint:fix` - Runs ESLint with custom configuration.
- **PWA Assets:** `pnpm generate-pwa-assets` - Generates PWA icons and assets.

## Project Structure

- `app/`: Main application code.
  - `assets/css/main.css`: Global styles.
  - `components/`: Vue components, including a custom `Chessboard.vue`.
  - `composables/`: Shared logic for blog, teams, tournaments, etc.
  - `pages/`: Nuxt pages, using file-based routing and Nuxt Content integration.
- `content/`: Source files for the website content.
  - `blog/article/`: Markdown files for blog posts.
  - `mannschaften/`: YAML/Markdown for team information.
  - `turniere/`: YAML/Markdown for tournament information.
  - `users/`: YAML files for club members/authors.
  - `index.yaml`: Landing page configuration.
- `content.config.ts`: Defines Zod schemas and collections for Nuxt Content 3.
- `nuxt.config.ts`: Main Nuxt configuration, modules, and deployment settings.
- `app.config.ts`: Global application configuration (navigation, social links, theme colors, chessboard settings).
- `public/assets/`: Static assets like images for blog posts and users.

## Development Conventions

- **Content Management:** All content should be placed in the `content/` directory and must adhere to the schemas defined in `content.config.ts`.
- **UI Components:** Prefer using components from Nuxt UI and the extended UI layer (`github:happydesigns/ui`).
- **Theme Colors:** Use the semantic colors `primary`, `secondary`, `jugend`, `mannschaft`, and `verein` where applicable.
- **Images:** Use the `<NuxtImg>` component for optimized images. Blog images are typically located in `public/assets/blog/`.
- **Type Safety:** The project uses TypeScript. Ensure new components and composables are properly typed.

## Specialized Features

### Blog RSS
A custom RSS feed is generated via a server route in `server/routes/blog/rss.xml.ts`.
