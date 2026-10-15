import { cp, readFile, rm, writeFile } from "node:fs/promises";

await cp(
	new URL("../../skills/showrunner/", import.meta.url),
	new URL("../../dist/site/skill/", import.meta.url),
	{ recursive: true },
);
console.log("Website built in dist/site");

const legacyRoute = new URL("../../dist/site/getting-started.html", import.meta.url);
const guide = await readFile(new URL("./index.html", legacyRoute.href + "/"));
await rm(legacyRoute, { recursive: true });
await writeFile(legacyRoute, guide);
