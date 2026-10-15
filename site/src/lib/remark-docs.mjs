const routes = {
	"getting-started": "/docs/getting-started/#first",
	"agent-skill": "/docs/agent-skill/",
	usage: "/docs/configuration/",
	"pull-requests": "/docs/pull-requests/",
	presentation: "/docs/api/",
	architecture: "/docs/architecture/",
	license: "/docs/license/",
};

export default function docsMarkdown() {
	return (tree) => {
		if (tree.children[0]?.type === "heading" && tree.children[0].depth === 1) tree.children.shift();
		const visit = (node) => {
			if (node.type === "link" && !/^(https?:|mailto:|#|\/)/.test(node.url)) {
				const [file, hash] = node.url.split("#");
				const id = file.replace(/\.md$/, "");
				const route = routes[id];
				node.url = route
					? `${route}${hash ? `#${hash}` : ""}`
					: `https://github.com/smeltery/showrunner/blob/main/${file.startsWith("../") ? file.slice(3) : `docs/${file}`}${hash ? `#${hash}` : ""}`;
			}
			if (node.type === "code" && node.lang === "mermaid") {
				const source = node.value
					.replaceAll("&", "&amp;")
					.replaceAll("<", "&lt;")
					.replaceAll(">", "&gt;");
				node.type = "html";
				node.value = `<details class="diagram-source"><summary>Workflow diagram source</summary><pre tabindex="0"><code>${source}</code></pre></details>`;
			}
			for (const child of node.children ?? []) visit(child);
		};
		visit(tree);
	};
}
