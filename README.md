# Showrunner

**Make your pull request worth watching.**

A small, website-agnostic Playwright toolkit for replayable PR demos: visible cursor movement, paced typing, captions, chapter cards, and standard Playwright video recording. No application dependencies, hosted service, or custom CLI.

## First take

Requires Node.js 22+ and pnpm.

```sh
pnpm install
pnpm exec playwright install chromium
pnpm demo
pnpm exec playwright show-report
```

To use an installed Chrome instead of downloading Chromium, run `SHOWRUNNER_BROWSER_CHANNEL=chrome pnpm demo`. The same variable works with `pnpm test:agent`.

The included release-checklist demo is self-contained. It needs no server, account, or network after installation. Add `--headed` to watch it live. Recordings and traces appear in `test-results/` and the HTML report; generated artifacts are ignored by Git.

## Use with your website

Build this local package and install it in your application's test workspace:

```sh
cd ~/Code/github.com/smeltery/showrunner
pnpm build
cd /path/to/your/app
pnpm add -D @playwright/test /absolute/path/to/showrunner
```

The package is currently local and private; it has not been published to npm.

Create a dedicated config, `playwright.demo.config.ts`:

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "./demos",
	testMatch: "**/*.demo.ts",
	reporter: [["list"], ["html", { open: "never" }]],
	use: {
		baseURL: process.env.DEMO_BASE_URL ?? "http://localhost:3000",
		viewport: { width: 1280, height: 720 },
		video: "on",
		trace: "on",
	},
});
```

Create `demos/profile.demo.ts`, adapting the route and accessible names to your application:

```ts
import { test, expect } from "@smeltery/showrunner";

test("should save a new display name", async ({ page, demo }) => {
	await page.goto("/settings/profile");
	await demo.caption("Update your display name");
	await demo.fill(page.getByRole("textbox", { name: "Display name" }), "River");
	await demo.click(page.getByRole("button", { name: "Save" }));
	await expect(page.getByRole("status")).toHaveText("Profile saved");
	await demo.beat();
});
```

Run it against your running app:

```sh
DEMO_BASE_URL=http://localhost:3000 pnpm exec playwright test --config=playwright.demo.config.ts --headed
```

Your app owns authentication, API seeding, page objects, and cleanup. Configure Playwright `storageState` or setup fixtures as usual. Use disposable data and restore changes after the scenario. Keep auth files and recordings out of Git.

## Existing fixtures

Playwright's `mergeTests` composes the demo fixture with your own fixtures:

```ts
import { mergeTests } from "@playwright/test";
import { test as demoTest } from "@smeltery/showrunner";
import { test as appTest } from "./app-fixtures.js";

export const test = mergeTests(appTest, demoTest);
```

For another page or popup, instantiate `new Demo(page)` and `await demo.install()`. The constructor is also available when you prefer to wire your own fixture.

## Presentation API

| Method                                           | Behavior                                                           |
| ------------------------------------------------ | ------------------------------------------------------------------ |
| `demo.click(locator)`                            | Move the visible pointer, perform a normal Playwright click, pause |
| `demo.fill(locator, text)`                       | Clear existing content, then type at a readable pace               |
| `demo.typeHuman(locator, text)`                  | Append characters using Playwright keyboard input                  |
| `demo.moveTo(locator)`                           | Scroll into view and move the pointer to the target                |
| `demo.caption(text)`                             | Show a non-interactive bottom caption                              |
| `demo.clearCaption()`                            | Remove the caption                                                 |
| `demo.interstitial(title, body?, milliseconds?)` | Show a chapter card, pause, remove it                              |
| `demo.beat(milliseconds?)`                       | Pause for presentation; defaults to 700 ms                         |
| `demo.ensure()`                                  | Restore the overlay after replacing the document content           |

`test.use({ demoOptions: { pace: 0 } })` disables presentation delays. The default is `1`; `2` doubles them. Assertions and Playwright actionability checks remain active. Use assertions for readiness, never presentation delays. Normal navigation installs the overlay automatically; actions also ensure it exists. Captions reset across navigation. Overlay styles live in a shadow root, and captions are inserted as literal text.

## PR workflow

1. Commit a `*.demo.ts` scenario with the product change.
2. Seed and authenticate quickly; use `demo.*` for the behavior a reviewer should watch.
3. Assert the intended outcome. A recording alone does not establish correctness.
4. Include the exact replay command, what a pass demonstrates, what to watch beyond the exit code, and what remains unproven. A template is included in `.github/pull_request_template.md`.
5. Optionally attach the video through your review platform. Never commit videos, traces, or credentials.

For the bundled demo:

- **Command:** `pnpm demo`
- **A pass demonstrates:** replacing the draft creates exactly one checklist item with the entered text.
- **Watch for:** a readable cursor, captions, and typing; the original draft must not be prepended.
- **Does not prove:** backend persistence, authentication, multi-user behavior, or integration with your application.

Demos run on demand. Consumers can add a manually triggered CI workflow using their own environment and artifact policies. This project does not upload artifacts or post PR comments.

Playwright records WebM. For optional MP4 sharing, use a locally installed ffmpeg:

```sh
ffmpeg -i test-results/<scenario>/video.webm -c:v libx264 -pix_fmt yuv420p -movflags +faststart demo.mp4
```

Automatic trimming, voiceover, and video editing are outside this initial version.

## Development

```sh
pnpm build
pnpm type-check
pnpm test:agent
pnpm fmt:check
```

See the official Playwright documentation for [fixture composition](https://playwright.dev/docs/test-fixtures) and [recording video](https://playwright.dev/docs/videos).
