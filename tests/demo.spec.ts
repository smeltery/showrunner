import { test, expect, Demo } from "../src/index.js";

test.use({ demoOptions: { pace: 0 } });

test("should replace existing values and interact through captions", async ({ page, demo }) => {
	await page.setContent(
		`<label>Name <input value="old"></label><button onclick="this.textContent='Saved'">Save</button>`,
	);
	await demo.caption("<b>Literal caption</b>");
	await expect(page.locator("showrunner-overlay").locator("#caption")).toHaveText(
		"<b>Literal caption</b>",
	);
	await demo.fill(page.getByRole("textbox"), "new");
	await expect(page.getByRole("textbox")).toHaveValue("new");
	await demo.click(page.getByRole("button"));
	await expect(page.getByRole("button")).toHaveText("Saved");
	await demo.clearCaption();
	await expect(page.locator("showrunner-overlay").locator("#caption")).toBeHidden();
});

test("should restore the overlay after navigation and reload", async ({ page, demo }) => {
	await page.route("https://showrunner.test/**", (route) =>
		route.fulfill({ contentType: "text/html", body: "<button>Continue</button>" }),
	);
	await page.goto("https://showrunner.test/");
	await demo.click(page.getByRole("button"));
	await page.reload();
	await demo.caption("After reload");
	await expect(page.locator("showrunner-overlay")).toHaveCount(1);
	await expect(page.locator("showrunner-overlay").locator("#caption")).toHaveText("After reload");
	await demo.interstitial("Chapter", "Body");
	await expect(page.locator("showrunner-overlay").locator("#chapter")).toBeHidden();
});

test("should reject invalid pacing and preserve Playwright action failures", async ({
	page,
	demo,
}) => {
	expect(() => new Demo(page, { pace: -1 })).toThrow("pace");
	await expect(demo.beat(Number.NaN)).rejects.toThrow("beat");
	page.setDefaultTimeout(100);
	await page.setContent("<button disabled>Save</button>");
	await expect(demo.click(page.getByRole("button"))).rejects.toThrow();
});
