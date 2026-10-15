for (const block of document.querySelectorAll(".docs-article pre")) {
	if (block.closest(".command")?.querySelector(".command-header")) continue;
	block.tabIndex = 0;
	const existing = block.parentElement.matches(".command") ? block.parentElement : null;
	const wrapper = existing ?? document.createElement("div");
	wrapper.className = "docs-code-block";
	const button = document.createElement("button");
	button.type = "button";
	button.className = "docs-code-copy";
	button.textContent = "Copy code";
	const status = document.createElement("p");
	status.className = "sr-only";
	status.setAttribute("role", "status");
	if (!existing) block.before(wrapper);
	const toolbar = document.createElement("div");
	toolbar.className = "docs-code-toolbar";
	const language = document.createElement("span");
	language.textContent = block.dataset.language ?? "Code";
	toolbar.append(language, button);
	wrapper.append(toolbar, block, status);
	button.addEventListener("click", async () => {
		try {
			await navigator.clipboard.writeText(block.textContent);
			status.textContent = "Code copied to clipboard.";
		} catch {
			status.textContent = "Clipboard unavailable. Select and copy the code manually.";
			block.focus();
		}
	});
}
