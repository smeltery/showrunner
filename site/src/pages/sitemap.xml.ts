import type { APIRoute } from "astro";
import { docPages } from "../lib/docs";

export const GET: APIRoute = ({ site }) => {
	const paths = ["/", ...docPages.map((page) => page.href)];
	const urls = site
		? paths.map((path) => `<url><loc>${new URL(path, site).href}</loc></url>`).join("")
		: "";
	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
		{
			headers: { "Content-Type": "application/xml" },
		},
	);
};
