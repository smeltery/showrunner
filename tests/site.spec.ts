import { test, expect } from "@playwright/test";
import { spawn, execFileSync, type ChildProcess } from "node:child_process";

let server: ChildProcess;
const origin = "http://127.0.0.1:4175";

test.describe.configure({ mode: "serial" });

test.beforeAll(async () => {
	execFileSync(process.execPath, ["scripts/site/build.mjs"]);
	server = spawn(process.execPath, ["scripts/site/serve.mjs"], {
		env: { ...process.env, PORT: "4175" },
		stdio: ["ignore", "pipe", "pipe"],
	});
	await new Promise<void>((resolve, reject) => {
		server.once("error", reject);
		server.once("exit", (code) => reject(new Error(`Website server exited: ${code}`)));
		server.stdout!.once("data", () => resolve());
	});
});

test.afterAll(() => server?.kill());

test("website sequence advances and replays without losing context", async ({ page }) => {
	await page.goto(origin);
	const next = page.getByRole("button", { name: "Next step" });
	await next.click();
	await expect(page.locator("#demo-input")).toHaveText("Ship a replayable demo");
	await next.click();
	await expect(page.locator("#demo-result")).toHaveText("✓ Ship a replayable demo");
	await next.click();
	await expect(page.locator("#demo-status")).toContainText("Assert the result");
	await page.getByRole("button", { name: "Replay" }).click();
	await expect(page.locator("#demo-input")).toHaveText("Draft task");
	await expect(page.locator("#demo-result")).toContainText("Your next task starts here");
	await page.getByRole("main").getByRole("link", { name: "Get the agent skill" }).click();
	await expect(page).toHaveURL(`${origin}/docs/getting-started/`);
});

test("website clipboard failures preserve selectable instructions", async ({ page }) => {
	await page.goto(`${origin}/docs/getting-started/`);
	await page.evaluate(() => {
		Object.defineProperty(navigator, "clipboard", {
			value: {
				writeText: async () => {
					throw new Error("Clipboard denied");
				},
			},
			configurable: true,
		});
	});
	await page.getByRole("button", { name: "Copy commands" }).click();
	await expect(page.locator("#quickstart-status")).toContainText("Select and copy");
	await expect(page.locator("pre").filter({ has: page.locator("#quickstart") })).toBeFocused();
	await page.evaluate(() => {
		Object.defineProperty(navigator, "clipboard", {
			value: {
				writeText: async (text: string) => {
					document.body.dataset.copied = text;
				},
			},
		});
	});
	await page.getByRole("button", { name: "Copy commands" }).click();
	await expect(page.locator("#quickstart-status")).toContainText("Copied.");
	await expect(page.locator("body")).toHaveAttribute("data-copied", /pnpm demo/);
});

test("website remains readable without scripts and recovers from missing pages", async ({
	browser,
}) => {
	const context = await browser.newContext({
		javaScriptEnabled: false,
		viewport: { width: 320, height: 700 },
	});
	const page = await context.newPage();
	await page.goto(origin);
	await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
	await expect(page.getByRole("button", { name: "Next step" })).toBeHidden();
	await page.getByRole("main").getByRole("link", { name: "Get the agent skill" }).click();
	await expect(page.locator("#quickstart")).toContainText("pnpm demo");
	const response = await page.goto(`${origin}/missing-scene`);
	expect(response?.status()).toBe(404);
	await page.getByRole("link", { name: "Back to Showrunner" }).click();
	await expect(page).toHaveURL(`${origin}/`);
	await context.close();
});

test("agent prompt copies to the agent and anchor scrolling respects reduced motion", async ({
	page,
}) => {
	await page.goto(`${origin}/docs/getting-started/`);
	await page.evaluate(() => {
		Object.defineProperty(navigator, "clipboard", {
			value: {
				writeText: async (text: string) => {
					document.body.dataset.copied = text;
				},
			},
		});
	});
	await page.getByRole("button", { name: "Copy prompt", exact: true }).click();
	await expect(page.locator("#agent-prompt-status")).toContainText("coding agent");
	await expect(page.locator("body")).toHaveAttribute("data-copied", /Use the showrunner skill/);
	const skill = await page.request.get(`${origin}/skill/SKILL.md`);
	expect(skill.ok()).toBe(true);
	expect(skill.headers()["content-type"]).toContain("text/plain");
	await page.goto(origin);
	await page.emulateMedia({ reducedMotion: "no-preference" });
	await expect(page.locator("html")).toHaveCSS("scroll-behavior", "smooth");
	await page.getByRole("main").getByRole("link", { name: "See the sequence" }).click();
	await expect(page).toHaveURL(`${origin}/#demo`);
	await expect
		.poll(() =>
			page.locator("#demo").evaluate((element) => Math.round(element.getBoundingClientRect().top)),
		)
		.toBe(108);
	await page.emulateMedia({ reducedMotion: "reduce" });
	await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
	await page
		.getByRole("navigation", { name: "Main navigation", exact: true })
		.getByRole("link", { name: "How it works" })
		.click();
	await expect(page).toHaveURL(`${origin}/#workflow`);
	await expect
		.poll(() =>
			page
				.locator("#workflow")
				.evaluate((element) => Math.round(element.getBoundingClientRect().top)),
		)
		.toBe(108);
});

test("mobile navigation contains focus, restores scrolling, and follows links", async ({
	page,
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto(origin);
	const toggle = page.getByRole("button", { name: "Menu", exact: true });
	const dialog = page.getByRole("dialog", { name: "Where to next?" });
	await toggle.click();
	await expect(toggle).toHaveAttribute("aria-expanded", "true");
	await expect(dialog.getByRole("button", { name: "Close navigation" })).toBeFocused();
	await expect(page.locator("html")).toHaveCSS("overflow", "hidden");
	for (let index = 0; index < 14; index++) {
		await page.keyboard.press("Tab");
		expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
	}
	await page.keyboard.press("Escape");
	await expect(dialog).not.toBeVisible();
	await expect(toggle).toBeFocused();
	await expect(toggle).toHaveAttribute("aria-expanded", "false");
	await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden");
	await toggle.click();
	await dialog.getByRole("link", { name: "See the sequence" }).click();
	await expect(dialog).not.toBeVisible();
	await expect(page).toHaveURL(`${origin}/#demo`);
	await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden");
	await toggle.click();
	await dialog.getByRole("link", { name: "Get the agent skill" }).click();
	await expect(page).toHaveURL(`${origin}/docs/getting-started/`);

	const docsToggle = page.getByRole("button", { name: "Open documentation navigation" });
	const docsDialog = page.getByRole("dialog", { name: "Documentation", exact: true });
	await docsToggle.click();
	await expect(docsDialog.locator('a[aria-current="page"]')).toHaveText("Getting started");
	await page.keyboard.press("Escape");
	await expect(docsToggle).toBeFocused();
	await docsToggle.click();
	await page.setViewportSize({ width: 1280, height: 900 });
	await expect(docsDialog).not.toBeVisible();
	await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden");
});

test("mobile navigation works without JavaScript through the footer", async ({ browser }) => {
	const context = await browser.newContext({
		javaScriptEnabled: false,
		viewport: { width: 320, height: 700 },
	});
	const page = await context.newPage();
	await page.goto(origin);
	await page.getByRole("link", { name: "Menu", exact: true }).click();
	await expect(page).toHaveURL(`${origin}/#footer-navigation`);
	await expect
		.poll(() =>
			page
				.locator("#footer-navigation")
				.evaluate((element) => Math.round(element.getBoundingClientRect().top)),
		)
		.toBe(108);
	await page
		.getByRole("navigation", { name: "Footer product" })
		.getByRole("link", { name: "Get the agent skill" })
		.click();
	await expect(page).toHaveURL(`${origin}/docs/getting-started/`);
	await expect(page.getByRole("navigation", { name: "Documentation pages" })).toBeAttached();
	await context.close();
});

test("docs search finds content, handles empty results, and restores focus", async ({ page }) => {
	await page.goto(`${origin}/docs/getting-started/`);
	const trigger = page.getByRole("button", { name: "Search documentation", exact: true });
	await trigger.click();
	const search = page.getByRole("dialog", { name: "Search documentation", exact: true });
	const input = search.getByRole("searchbox");
	await expect(input).toBeFocused();
	await page.keyboard.press("ArrowDown");
	await expect(search.getByRole("link", { name: /^Getting started/ })).toBeFocused();
	await page.keyboard.press("ArrowDown");
	await expect(search.getByRole("link", { name: /^Agent workflow/ })).toBeFocused();
	await page.keyboard.press("ArrowUp");
	await expect(search.getByRole("link", { name: /^Getting started/ })).toBeFocused();
	await input.focus();
	await input.fill("zzzznonexistent");
	await expect(search.getByRole("status")).toContainText("No matching pages");
	await search.getByRole("button", { name: "Clear", exact: true }).click();
	await input.fill("caption");
	await search.getByRole("link", { name: /^Presentation API/ }).click();
	await expect(page).toHaveURL(`${origin}/docs/api/`);
	await expect(page.getByRole("heading", { level: 1 })).toHaveText("Presentation API");
	await expect(trigger).toBeVisible();
	await page.keyboard.press("Control+k");
	await expect(search).toBeVisible();
	await page.keyboard.press("Escape");
	await expect(trigger).toBeFocused();
	await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden");
});

test("documentation actions copy Markdown and prepare page-specific chat prompts", async ({
	page,
}) => {
	await page.goto(`${origin}/docs/api/`);
	await page.evaluate(() =>
		Object.defineProperty(navigator, "clipboard", {
			value: {
				writeText: async (value: string) => {
					document.body.dataset.markdown = value;
				},
			},
			configurable: true,
		}),
	);
	await page.getByRole("button", { name: "Copy as Markdown" }).click();
	await expect(page.locator("body")).toHaveAttribute("data-markdown", /demoOptions/);
	await page.getByText("Open in chat", { exact: true }).click();
	const chat = page.getByRole("link", { name: "Claude", exact: true });
	const prompt = new URL((await chat.getAttribute("href"))!).searchParams.get("q");
	expect(prompt).toContain("Help me use Showrunner");
	expect(prompt).toContain("demoOptions");
	await page.evaluate(() =>
		Object.defineProperty(navigator, "clipboard", {
			value: {
				writeText: async () => {
					throw new Error("Denied");
				},
			},
		}),
	);
	await page.getByRole("button", { name: "Markdown copied" }).click();
	await expect(page.getByRole("textbox", { name: "Page Markdown" })).toBeFocused();
	await expect(page.getByRole("textbox", { name: "Page Markdown" })).toHaveValue(/demoOptions/);
	await page.goto(`${origin}/docs/getting-started/`);
	await page.evaluate(() =>
		Object.defineProperty(navigator, "clipboard", {
			value: {
				writeText: async (value: string) => {
					document.body.dataset.markdown = value;
				},
			},
		}),
	);
	await page.getByRole("button", { name: "Copy as Markdown" }).click();
	await expect(page.locator("body")).toHaveAttribute("data-markdown", /# Your first demo/);
	await expect(page.locator("body")).toHaveAttribute("data-markdown", /npx skills add/);
});

test("legacy getting-started links redirect and preserve section anchors", async ({ page }) => {
	const response = await page.request.get(`${origin}/getting-started.html`, { maxRedirects: 0 });
	expect(response.status()).toBe(301);
	expect(response.headers().location).toBe("/docs/getting-started/");
	await page.goto(`${origin}/getting-started.html#first`);
	await expect(page).toHaveURL(`${origin}/docs/getting-started/#first`);
	await expect(page.locator("#first")).toBeVisible();
});
