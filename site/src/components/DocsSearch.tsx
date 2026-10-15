import { useEffect, useRef, useState } from "react";
import type { SearchEntry } from "../lib/docs";

export default function DocsSearch({ entries }: { entries: SearchEntry[] }) {
	const [ready, setReady] = useState(false);
	const [query, setQuery] = useState("");
	const dialog = useRef<HTMLDialogElement>(null);
	const trigger = useRef<HTMLButtonElement>(null);
	const input = useRef<HTMLInputElement>(null);
	const previousOverflow = useRef("");
	const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
	const results = entries.filter((entry) =>
		words.every((word) =>
			`${entry.title} ${entry.description} ${entry.text}`.toLowerCase().includes(word),
		),
	);

	function openSearch() {
		if (!dialog.current || dialog.current.open) return;
		previousOverflow.current = document.documentElement.style.overflow;
		document.documentElement.style.overflow = "hidden";
		dialog.current.showModal();
		input.current?.focus();
	}
	function closeSearch() {
		dialog.current?.close();
	}
	useEffect(() => {
		setReady(true);
		const onKeyDown = (event: KeyboardEvent) => {
			if (
				(event.metaKey || event.ctrlKey) &&
				event.key.toLowerCase() === "k" &&
				!document.querySelector("dialog[open]")
			) {
				event.preventDefault();
				openSearch();
			}
		};
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, []);
	return (
		<>
			<button
				ref={trigger}
				className="docs-search-trigger"
				aria-label="Search documentation"
				aria-haspopup="dialog"
				hidden={!ready}
				onClick={openSearch}
			>
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.6"
					aria-hidden="true"
				>
					<circle cx="10.5" cy="10.5" r="6.5" />
					<path d="m16 16 4 4" />
				</svg>
				<span>Search docs</span>
				<kbd>⌘ K</kbd>
			</button>
			<dialog
				ref={dialog}
				className="docs-search-dialog"
				aria-labelledby="search-title"
				onClose={() => {
					document.documentElement.style.overflow = previousOverflow.current;
					trigger.current?.focus({ preventScroll: true });
				}}
				onClick={(event) => {
					if (event.target === event.currentTarget) closeSearch();
				}}
				onKeyDown={(event) => {
					const links = [
						...event.currentTarget.querySelectorAll<HTMLAnchorElement>(".search-results a"),
					];
					const index = links.indexOf(document.activeElement as HTMLAnchorElement);
					if (event.key === "ArrowDown" || event.key === "ArrowUp") {
						event.preventDefault();
						if (!links.length) return;
						const next =
							event.key === "ArrowDown"
								? (index + 1) % links.length
								: index <= 0
									? links.length - 1
									: index - 1;
						links[next]?.focus();
						return;
					}
					if (event.key === "Enter" && document.activeElement === input.current && links[0]) {
						event.preventDefault();
						links[0].click();
						return;
					}
					if (event.key !== "Tab") return;
					const controls = [
						...event.currentTarget.querySelectorAll<HTMLElement>("button, input, a[href]"),
					].filter((element) => element.getClientRects().length);
					const first = controls[0];
					const last = controls.at(-1);
					if (event.shiftKey && document.activeElement === first) {
						event.preventDefault();
						last?.focus();
					} else if (!event.shiftKey && document.activeElement === last) {
						event.preventDefault();
						first?.focus();
					}
				}}
			>
				<div className="search-panel">
					<h2 id="search-title" className="sr-only">
						Search documentation
					</h2>
					<label htmlFor="docs-search-input" className="sr-only">
						Search documentation
					</label>
					<div className="search-input-row">
						<svg
							className="search-field-icon"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.6"
							aria-hidden="true"
						>
							<circle cx="10.5" cy="10.5" r="6.5" />
							<path d="m16 16 4 4" />
						</svg>
						<input
							ref={input}
							id="docs-search-input"
							type="search"
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder="Search documentation…"
							autoComplete="off"
						/>
						<button
							hidden={!query}
							onClick={() => {
								setQuery("");
								input.current?.focus();
							}}
						>
							Clear
						</button>
						<button className="search-dismiss" aria-label="Close search" onClick={closeSearch}>
							<span aria-hidden="true">Esc</span>
						</button>
					</div>
					<div className="search-scroll">
						<p className="search-count" role="status">
							{results.length
								? `${results.length} ${results.length === 1 ? "page" : "pages"} ${query ? "found" : "in documentation"}`
								: "No matching pages. Try another term or clear your search."}
						</p>
						<nav className="search-results" aria-label="Search results">
							{results.map((entry) => (
								<a key={entry.href} href={entry.href} onClick={closeSearch}>
									<svg
										className="search-page-icon"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.4"
										aria-hidden="true"
									>
										<path d="M5 3h9l5 5v13H5zM14 3v6h5M8 13h8M8 17h6" />
									</svg>
									<span className="search-result-text">
										<strong>{entry.title}</strong>
										<span>{entry.description}</span>
									</span>
									<span className="search-enter" aria-hidden="true">
										↵
									</span>
								</a>
							))}
						</nav>
					</div>
					<div className="search-footer">
						<span>
							<kbd>↑</kbd>
							<kbd>↓</kbd> to navigate
						</span>
						<span>
							<kbd>↵</kbd> to open
						</span>
						<span>
							<kbd>esc</kbd> to close
						</span>
					</div>
				</div>
			</dialog>
		</>
	);
}
