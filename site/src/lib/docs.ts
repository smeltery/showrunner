export const docPages = [
	{
		id: "getting-started",
		href: "/docs/getting-started/",
		title: "Getting started",
		group: "Start here",
		description: "Install the agent skill and record your first demo.",
	},
	{
		id: "agent-skill",
		href: "/docs/agent-skill/",
		title: "Agent workflow",
		group: "Start here",
		description: "Let your agent write, verify, and record the story.",
	},
	{
		id: "usage",
		href: "/docs/configuration/",
		title: "Installation & configuration",
		group: "Guides",
		description: "Runtime installation, Playwright configuration, and app fixtures.",
	},
	{
		id: "pull-requests",
		href: "/docs/pull-requests/",
		title: "Pull request demos",
		group: "Guides",
		description: "Share the recording and explain what a pass demonstrates.",
	},
	{
		id: "presentation",
		href: "/docs/api/",
		title: "Presentation API",
		group: "Reference",
		description: "Cursor, typing, captions, chapter cards, and pacing.",
	},
	{
		id: "architecture",
		href: "/docs/architecture/",
		title: "Architecture",
		group: "Reference",
		description: "How the Playwright fixture and presentation overlay fit together.",
	},
	{
		id: "license",
		href: "/docs/license/",
		title: "License",
		group: "Project",
		description: "PolyForm Shield terms and project attribution.",
	},
];
export const docGroups = [...new Set(docPages.map((page) => page.group))];
export interface SearchEntry {
	title: string;
	href: string;
	description: string;
	text: string;
}
