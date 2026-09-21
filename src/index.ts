import { test as base, expect, type Locator, type Page } from "@playwright/test";

export interface DemoOptions {
	pace?: number;
}

function installOverlay() {
	if (!document.body) {
		document.addEventListener("DOMContentLoaded", installOverlay, { once: true });
		return;
	}
	if (document.querySelector("showrunner-overlay")) return;
	const host = document.createElement("showrunner-overlay");
	host.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:2147483647";
	const root = host.attachShadow({ mode: "open" });
	const style = document.createElement("style");
	style.textContent = `
    :host { all: initial; }
    #cursor { position:fixed; left:0; top:0; color:#fff; font:28px system-ui;
      text-shadow:0 1px 4px #000; transform:translate(-100px,-100px); }
    #caption, #chapter { position:fixed; color:#fff; background:#111827ee;
      font:600 22px/1.5 system-ui; text-align:center; border-radius:16px;
      padding:20px 28px; white-space:pre-wrap; overflow-wrap:anywhere; }
    #caption { bottom:32px; left:50%; transform:translateX(-50%); max-width:80vw; }
    #chapter { inset:20%; display:grid; place-content:center; font-size:32px; }
    [hidden] { display:none !important; }
  `;
	const cursor = document.createElement("div");
	cursor.id = "cursor";
	cursor.textContent = "➤";
	const caption = document.createElement("div");
	caption.id = "caption";
	caption.hidden = true;
	const chapter = document.createElement("div");
	chapter.id = "chapter";
	chapter.hidden = true;
	root.append(style, cursor, caption, chapter);
	host.setAttribute("aria-hidden", "true");
	document.body.append(host);
	document.addEventListener("mousemove", (event) => {
		cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px) rotate(-35deg)`;
	});
	document.addEventListener("pointerdown", () => {
		cursor.animate([{ opacity: 0.35 }, { opacity: 1 }], { duration: 350 });
	});
}

export class Demo {
	private readonly pace: number;

	constructor(
		private readonly page: Page,
		options: DemoOptions = {},
	) {
		this.pace = options.pace ?? 1;
		if (!Number.isFinite(this.pace) || this.pace < 0) {
			throw new Error("Demo pace must be a finite, non-negative number");
		}
	}

	async install(): Promise<void> {
		await this.page.addInitScript(installOverlay);
		await this.ensure();
	}

	async ensure(): Promise<void> {
		await this.page.evaluate(installOverlay);
	}

	async beat(milliseconds = 700): Promise<void> {
		if (!Number.isFinite(milliseconds) || milliseconds < 0) {
			throw new Error("Demo beat must be a finite, non-negative number");
		}
		if (this.pace > 0) await this.page.waitForTimeout(milliseconds * this.pace);
	}

	async moveTo(locator: Locator): Promise<void> {
		if (locator.page() !== this.page) throw new Error("Use a Demo for the locator’s page");
		await this.ensure();
		await locator.scrollIntoViewIfNeeded();
		const bounds = await locator.boundingBox();
		if (!bounds) throw new Error("Demo target has no visible bounding box");
		await this.page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2, {
			steps: 24,
		});
	}

	async click(locator: Locator): Promise<void> {
		await this.moveTo(locator);
		await locator.click();
		await this.beat(350);
	}

	async typeHuman(locator: Locator, text: string): Promise<void> {
		await locator.pressSequentially(text, { delay: 45 * this.pace });
	}

	async fill(locator: Locator, text: string): Promise<void> {
		await this.moveTo(locator);
		await locator.fill("");
		await this.typeHuman(locator, text);
		await this.beat(250);
	}

	private async overlay(id: "caption" | "chapter", text: string | null): Promise<void> {
		await this.ensure();
		await this.page.evaluate(
			({ id, text }) => {
				const element = document
					.querySelector("showrunner-overlay")
					?.shadowRoot?.getElementById(id);
				if (!element) throw new Error("Showrunner overlay is unavailable");
				element.textContent = text;
				element.hidden = text === null;
			},
			{ id, text },
		);
	}

	async caption(text: string): Promise<void> {
		await this.overlay("caption", text);
	}

	async clearCaption(): Promise<void> {
		await this.overlay("caption", null);
	}

	async interstitial(title: string, body = "", milliseconds = 2200): Promise<void> {
		await this.clearCaption();
		await this.overlay("chapter", [title, body].filter(Boolean).join("\n\n"));
		await this.beat(milliseconds);
		await this.overlay("chapter", null);
	}
}

export const test = base.extend<{ demo: Demo; demoOptions: DemoOptions }>({
	demoOptions: [{}, { option: true }],
	demo: async ({ page, demoOptions }, use) => {
		const demo = new Demo(page, demoOptions);
		await demo.install();
		await use(demo);
	},
});

export { expect };
