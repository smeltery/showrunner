import { defineConfig } from "@playwright/test";

export default defineConfig({
	fullyParallel: true,
	reporter: [["list"], ["html", { open: "never" }]],
	use: { viewport: { width: 1280, height: 720 }, channel: process.env.SHOWRUNNER_BROWSER_CHANNEL },
	projects: [
		{
			name: "demo",
			testDir: "./examples",
			testMatch: "**/*.demo.ts",
			use: { video: "on", trace: "on" },
		},
		{ name: "verification", testDir: "./tests" },
	],
});
