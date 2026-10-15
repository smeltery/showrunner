import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
	const published = process.env.VERCEL_ENV === "production";
	const body = published
		? "User-agent: *\nAllow: /\n" + (site ? `Sitemap: ${new URL("/sitemap.xml", site).href}\n` : "")
		: "User-agent: *\nDisallow: /\n";
	return new Response(body, { headers: { "Content-Type": "text/plain" } });
};
