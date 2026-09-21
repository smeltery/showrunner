# Showrunner

Website-agnostic TypeScript library for Playwright demo scenarios. Keep application authentication, URLs, data setup, and page objects in consumer repos.

Use standard Playwright locators and actionability checks. Presentation delays are for pacing, never readiness checks. Add assertions to demo scenarios. Commit scenarios, not generated media or credentials.

Develop inside `flox activate`. That environment provides Node.js 22, pnpm 10.13.1, Bun, pre-commit, shellcheck, and actionlint. Run `pnpm build`, `pnpm type-check`, `pnpm test:agent`, and `pnpm fmt:check` after changes. CI and pre-commit run the same gates through `scripts/check-docs.sh`, `scripts/check-hygiene.sh`, `scripts/check-whitespace.sh`, and `scripts/check-node.sh`. User docs live in `docs/`. Do not add code comments unless requested. Use conventional commits without attribution footers.
