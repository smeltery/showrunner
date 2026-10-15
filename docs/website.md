# Website

The Showrunner website lives in `site/`. It uses Astro to generate static pages and React for the interactive documentation search. Marketing navigation, the illustrative demo, and clipboard controls use small browser scripts. Documentation reference pages are generated from Markdown in `docs/`.

## Local preview

```sh
flox activate
pnpm install --frozen-lockfile
pnpm site:build
pnpm site:preview
```

Open <http://127.0.0.1:4173>. Set `PORT` to use another port. Rebuild after editing source; the preview serves the production files in `dist/site/`.

## Content

- `site/src/pages/`: Astro marketing, getting-started, documentation, and missing-page routes.
- `site/src/layouts/` and `site/src/components/`: shared page layouts, navigation, footer, and React search.
- `site/src/content.config.ts`: repository documentation collection.
- `site/public/`: shared CSS, browser scripts, brand assets, and robots rules.
- `site/astro.config.mjs`: static build and React integration.
- `skills/showrunner/`: maintained agent skill, copied to `/skill/` in the built website.

Keep package availability, installation, and API examples aligned with the existing documentation. This site does not collect visitor data or submit forms.

## Verification

Run `pnpm build`, `pnpm type-check`, `pnpm test:agent`, and `pnpm fmt:check`. Build the site before browser review. Verify navigation, all four demo steps and replay, clipboard success and failure, keyboard use, narrow layouts, and unknown-route recovery.

## Publishing

Production: <https://showrunner-orpin-phi.vercel.app/>. The Vercel project is connected to the public GitHub repository for deployments from `main`.

Vercel builds the Astro site with `pnpm site:build` and publishes `dist/site/`. The root `vercel.json` keeps the library build separate and redirects legacy documentation links. The local preview binds only to loopback and returns an actual 404 for unknown routes.

Production builds use `SITE_URL` or Vercel’s production domain for canonical links, the sitemap, and absolute social image URLs. Production pages allow indexing; preview and local builds remain `noindex`. Run `vercel --prod` from the linked repository to deploy.

Skill receipts and browser evidence remain local in the ignored `.website-studio/` directory.

## Brand assets and motion

GitHub links use the [GitHub mark from Octicons](https://github.com/primer/octicons/blob/main/icons/mark-github-16.svg), under the included MIT license. The Playwright label uses the [official Playwright logo](https://github.com/microsoft/playwright.dev/blob/main/static/img/playwright-logo.svg). Third-party marks identify the linked project or underlying library; they are not Showrunner branding. Their source licenses are retained in `site/public/assets/`.

Anchor navigation uses native CSS smooth scrolling. Reduced-motion preferences restore immediate scrolling; links, URL fragments, and browser history retain their native behavior.

The primary journey installs the agent skill from the public repository and copies a prompt to the user's coding agent. Manual runtime setup remains below it. Repository visibility and GitHub Package visibility are separate; the site retains the package authentication guidance.

The mobile menu is a native modal dialog with Escape dismissal, focus restoration, background scroll locking, and cleanup on desktop resize. Without JavaScript, the mobile Menu link jumps to the complete footer navigation. The shared HTML is present in the built pages before scripts load.

Use `pnpm site:dev` for Astro development with live updates. Getting started lives at `/docs/getting-started/`. The old `/getting-started.html` URL redirects to it. Documentation includes grouped navigation, page contents, search, code copying, and previous/next links. Without JavaScript, documentation navigation and articles remain available.

The social card uses the original Showrunner logo and existing GitHub/Playwright brand assets. Its editable source is `site/public/assets/social.svg`; the 1200 × 630 PNG is served at `/assets/social.png`. Regenerate both with `flox activate -- node scripts/site/social.mjs` (requires `rsvg-convert`). Both layouts share Open Graph and large-image Twitter metadata.
