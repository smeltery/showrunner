import { readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";

const assetDirectory = new URL("../../site/public/assets/", import.meta.url);
const embedded = async (name) =>
	"data:image/svg+xml;base64," + (await readFile(new URL(name, assetDirectory))).toString("base64");
const [mark, github, playwright, smeltery] = await Promise.all(
	["mark.svg", "github.svg", "playwright.svg", "smeltery.svg"].map(embedded),
);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs>
 <radialGradient id="glow" cx="100%" cy="0%" r="80%"><stop offset="0" stop-color="#e9dcc5"/><stop offset="1" stop-color="#f7f4ed"/></radialGradient>
</defs>
<rect width="1200" height="630" fill="#f7f4ed"/>
<rect width="1200" height="630" fill="url(#glow)" opacity=".55"/>
<rect x="0" y="0" width="1200" height="7" fill="#b83b17"/>
<image href="${mark}" x="64" y="57" width="44" height="44"/>
<text x="122" y="91" font-family="Arial, sans-serif" font-size="34" font-weight="700" letter-spacing="-1.4" fill="#24241f">showrunner<tspan fill="#b83b17">.</tspan></text>
<rect x="889" y="65" width="247" height="30" rx="15" fill="#eee7da"/>
<circle cx="909" cy="80" r="3" fill="#b83b17"/>
<text x="923" y="84" font-family="Arial, sans-serif" font-size="11" letter-spacing="1.3" fill="#66665c">AGENT-DIRECTED DEMOS</text>
<text x="60" y="252" font-family="Arial, sans-serif" font-size="77" font-weight="700" letter-spacing="-3.9" fill="#24241f">Make your pull request</text>
<text x="60" y="354" font-family="Georgia, serif" font-size="101" font-style="italic" letter-spacing="-4" fill="#b83b17">worth watching.</text>
<text x="65" y="419" font-family="Arial, sans-serif" font-size="23" fill="#66665c">Let your agent write, verify, and record the walkthrough.</text>
<path d="M64 486H1136" stroke="#d9d6cc"/>
<text x="65" y="541" font-family="Arial, sans-serif" font-size="12" letter-spacing="1.8" fill="#66665c">REPLAYABLE DEMOS. VERIFIED OUTCOMES.</text>
<image href="${smeltery}" x="65" y="551" width="28" height="29"/>
<text x="103" y="571" font-family="Arial, sans-serif" font-size="14" fill="#66665c">Made by Smeltery</text>
<image href="${playwright}" x="833" y="527" width="37" height="37"/>
<text x="880" y="551" font-family="Arial, sans-serif" font-size="17" fill="#24241f">Playwright</text>
<path d="M991 529V563" stroke="#d9d6cc"/>
<image href="${github}" x="1014" y="534" width="25" height="25"/>
<text x="1049" y="552" font-family="Arial, sans-serif" font-size="17" fill="#24241f">GitHub</text>
</svg>`;
const source = new URL("social.svg", assetDirectory);
const output = new URL("social.png", assetDirectory);
await writeFile(source, svg + "\n");
execFileSync("rsvg-convert", ["--output", output.pathname, source.pathname]);
console.log("Generated 1200 × 630 social.svg and social.png");
