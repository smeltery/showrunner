import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const documentation = defineCollection({
	loader: glob({
		base: new URL("../../docs/", import.meta.url),
		pattern: "{agent-skill,usage,presentation,pull-requests,architecture,license}.md",
	}),
});
export const collections = { documentation };
