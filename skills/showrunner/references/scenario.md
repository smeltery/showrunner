# Scenario and recording setup

Use this when the consumer has no existing demo configuration. These examples assume an installed `@smeltery/showrunner` and compatible `@playwright/test`. Adapt routes, locators, fixtures, and readiness to the actual application.

## Two passes, one scenario

Create `playwright.demo.config.ts`, merging the relevant parts of existing configuration when present:

```ts
import { defineConfig } from "@playwright/test";
import type { DemoOptions } from "@smeltery/showrunner";

export default defineConfig<{ demoOptions: DemoOptions }>({
	testDir: "./demos",
	testMatch: "**/*.demo.ts",
	use: {
		baseURL: process.env.DEMO_BASE_URL ?? "http://localhost:3000",
		viewport: { width: 1280, height: 720 },
	},
	projects: [
		{
			name: "demo-verify",
			outputDir: "test-results/demo-verify",
			use: { demoOptions: { pace: 0 }, video: "off", trace: "retain-on-failure" },
		},
		{
			name: "demo-record",
			outputDir: "test-results/demo-record",
			use: { demoOptions: { pace: 1 }, video: "on", trace: "on" },
		},
	],
});
```

The application must already be running, or the config must reuse its established `webServer` setup. Add its `storageState` or setup-project dependencies if required. Do not hard-code credentials. Ensure `test-results/` and authentication state are ignored.

## Scenario shape

Create `demos/profile.demo.ts` only if these controls exist; otherwise adapt the story:

```ts
import { test, expect } from "@smeltery/showrunner";

test("save a display name", async ({ page, demo }) => {
	await page.goto("/settings/profile");
	await demo.caption("Update your display name");
	await demo.fill(page.getByRole("textbox", { name: "Display name" }), "River");
	await demo.click(page.getByRole("button", { name: "Save" }));
	await expect(page.getByRole("status")).toHaveText("Profile saved");
	await demo.caption("Saved. Ready for the next visit.");
	await demo.beat(1400);
});
```

A success message proves only that the UI displayed it. Add a reload or a consumer-specific persistence assertion when persistence is part of the requested change. Use a disposable user or an application fixture to restore the previous name between passes.

Run the focused file with the consumer's package manager:

```sh
pnpm exec playwright test --config=playwright.demo.config.ts --project=demo-verify demos/profile.demo.ts
pnpm exec playwright test --config=playwright.demo.config.ts --project=demo-record demos/profile.demo.ts
```

The recording project writes video and trace artifacts beneath `test-results/demo-record/`. Read the actual result paths; do not assume a generated test-directory slug. A configuration-level project pace is ineffective if the scenario overrides it with `test.use`, so check for overrides before claiming a zero-delay pass.

## Presentation calls

| Call                                             | Purpose                                                     |
| ------------------------------------------------ | ----------------------------------------------------------- |
| `demo.click(locator)`                            | Move the visible pointer, click with Playwright, then pause |
| `demo.fill(locator, text)`                       | Clear and type at a readable pace                           |
| `demo.typeHuman(locator, text)`                  | Append text with per-character pacing                       |
| `demo.caption(text)` / `demo.clearCaption()`     | Set or remove a non-interactive caption                     |
| `demo.interstitial(title, body?, milliseconds?)` | Show a chapter card, then remove it                         |
| `demo.beat(milliseconds?)`                       | Add a presentation pause, never a readiness check           |
| `demo.ensure()`                                  | Restore an overlay removed by document replacement          |

Caption and chapter strings are plain text. The overlay ignores pointer events and is hidden from the accessibility tree. The authoritative API for the installed version lives in its `docs/presentation.md`.
