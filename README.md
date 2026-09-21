# Showrunner

[![CI](https://github.com/smeltery/showrunner/actions/workflows/ci.yml/badge.svg)](https://github.com/smeltery/showrunner/actions/workflows/ci.yml)
[![License: PolyForm Shield 1.0.0](https://img.shields.io/badge/license-PolyForm%20Shield%201.0.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178c6.svg)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.63-2EAD33.svg)](https://playwright.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10.13-f69220.svg)](package.json)
[![Bun](https://img.shields.io/badge/bun-docs%20checks-black.svg)](tools/docs/package.json)
[![Flox](https://img.shields.io/badge/dev%20env-flox-7c3aed.svg)](https://flox.dev/)
[![GitHub Packages](https://img.shields.io/badge/GitHub%20Packages-%40smeltery%2Fshowrunner-blue)](https://github.com/smeltery/showrunner/pkgs/npm/showrunner)

**Make your pull request worth watching.**

Showrunner is a website-agnostic Playwright library for replayable pull request demos. A scenario keeps the visible cursor, paced typing, captions, and chapter cards. The application under test keeps authentication, URLs, data setup, and page objects. Playwright records the video.

`@smeltery/showrunner` is a private package on GitHub Packages. It is not on the public npm registry. Install it with a GitHub token that can read packages from `smeltery/showrunner`, or from a local build.

## Quick start

Requires [Flox](https://flox.dev/).

```sh
git clone git@github.com:smeltery/showrunner.git
cd showrunner
flox activate
pnpm install
pnpm exec playwright install chromium
pnpm demo
```

## Docs

- [Documentation index](docs/README.md)
- [Getting started](docs/getting-started.md)
- [Usage](docs/usage.md)
- [Presentation API](docs/presentation.md)
- [Pull requests](docs/pull-requests.md)
- [Architecture](docs/architecture.md)
- [Development](docs/development.md)
- [CI](docs/ci.md)
- [Releasing](docs/releasing.md)
- [License](docs/license.md)

## License

[PolyForm Shield License 1.0.0](LICENSE). Copyright (c) 2026 smeltery.
