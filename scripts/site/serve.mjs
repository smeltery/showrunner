import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";

const root = resolve("dist/site");
const port = Number(process.env.PORT ?? 4173);
const types = {
	".html": "text/html",
	".css": "text/css",
	".js": "text/javascript",
	".svg": "image/svg+xml",
	".png": "image/png",
	".txt": "text/plain",
	".md": "text/plain",
	".yaml": "text/plain",
};
const server = createServer(async (request, response) => {
	try {
		const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
		if (pathname === "/getting-started.html") {
			response.writeHead(301, { Location: "/docs/getting-started/" }).end();
			return;
		}
		const file = resolve(root, `.${pathname.endsWith("/") ? `${pathname}index.html` : pathname}`);
		if (!file.startsWith(`${root}${sep}`)) {
			response.writeHead(403).end("Forbidden");
			return;
		}
		try {
			const body = await readFile(file);
			response.writeHead(200, {
				"Content-Type": `${types[extname(file)] ?? "application/octet-stream"}; charset=utf-8`,
				"X-Content-Type-Options": "nosniff",
			});
			response.end(body);
		} catch (error) {
			if (error.code !== "ENOENT" && error.code !== "EISDIR") throw error;
			response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
			response.end(await readFile(resolve(root, "404.html")));
		}
	} catch (error) {
		console.error(error);
		response.writeHead(500).end("Unable to serve the website");
	}
});
server.listen(port, "127.0.0.1", () => console.log(`Showrunner: http://127.0.0.1:${port}`));
