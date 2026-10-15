import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import react from "@astrojs/react";
import docsMarkdown from "./src/lib/remark-docs.mjs";

export default defineConfig({
	output: "static",
	site:
		process.env.SITE_URL ??
		(process.env.VERCEL_PROJECT_PRODUCTION_URL
			? "https://" + process.env.VERCEL_PROJECT_PRODUCTION_URL
			: undefined),
	redirects: { "/getting-started.html": "/docs/getting-started/" },
	outDir: "../dist/site",
	integrations: [react()],
	markdown: {
		processor: unified({ remarkPlugins: [docsMarkdown] }),
		shikiConfig: { theme: "github-light" },
	},
});
