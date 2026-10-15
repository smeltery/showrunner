function articleMarkdown(node) {
	if (node.nodeType === Node.TEXT_NODE) return node.textContent;
	if (!(node instanceof Element)) return "";
	if (node.matches("button, .copy-status, .sr-only")) return "";
	if (node.matches("pre")) return "\n\n```\n" + node.textContent.trim() + "\n```\n\n";
	const content = [...node.childNodes].map(articleMarkdown).join("");
	if (/^H[1-6]$/.test(node.tagName))
		return "\n\n" + "#".repeat(Number(node.tagName[1])) + " " + content + "\n\n";
	if (node.matches("a"))
		return "[" + content + "](" + new URL(node.getAttribute("href"), location.href).href + ")";
	if (node.matches("code")) return "`" + content + "`";
	if (node.matches("li")) return "\n- " + content.trim();
	if (node.matches("p, section, div, ul, ol")) return "\n\n" + content.trim() + "\n\n";
	if (node.matches("br")) return " ";
	return content;
}
for (const actions of document.querySelectorAll(".doc-actions")) {
	const markdown =
		actions.dataset.markdown ||
		articleMarkdown(document.querySelector(".docs-article"))
			.replace(/\n{3,}/g, "\n\n")
			.trim();
	const copy = actions.querySelector(".copy-markdown");
	const status = actions.querySelector(".markdown-status");
	const fallback = actions.querySelector(".markdown-fallback");
	copy.hidden = false;
	copy.addEventListener("click", async () => {
		try {
			await navigator.clipboard.writeText(markdown);
			copy.querySelector("span").textContent = "Markdown copied";
			status.textContent = "Page Markdown copied to clipboard.";
			fallback.hidden = true;
		} catch {
			fallback.value = markdown;
			fallback.hidden = false;
			fallback.focus();
			fallback.select();
			status.textContent = "Clipboard unavailable. Select and copy the Markdown below.";
		}
	});
	const prompt = encodeURIComponent(
		"Help me use Showrunner based on this documentation:\n\n" + markdown,
	);
	for (const link of actions.querySelectorAll("[data-provider-url]"))
		link.href = link.dataset.providerUrl + prompt;
	actions.querySelector(".chat-actions").hidden = false;
}
