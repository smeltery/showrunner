const menu = document.querySelector("#mobile-menu");
const menuToggle = document.querySelector(".menu-toggle");
const closeButton = document.querySelector(".menu-close");
const mobileViewport = window.matchMedia(menu?.dataset.breakpoint ?? "(max-width: 780px)");

if (menu && menuToggle && closeButton && typeof menu.showModal === "function") {
	menuToggle.hidden = false;
	document.documentElement.classList.add("has-mobile-menu");
	document.querySelector(".menu-fallback").hidden = true;
	let previousOverflow = "";
	let previousGutter = "";

	const closeMenu = () => {
		if (menu.open) menu.close();
	};

	menuToggle.addEventListener("click", () => {
		previousOverflow = document.documentElement.style.overflow;
		previousGutter = document.documentElement.style.scrollbarGutter;
		document.documentElement.style.scrollbarGutter = "stable";
		document.documentElement.style.overflow = "hidden";
		menu.showModal();
		menuToggle.setAttribute("aria-expanded", "true");
	});
	closeButton.addEventListener("click", closeMenu);
	menu.addEventListener("close", () => {
		document.documentElement.style.overflow = previousOverflow;
		document.documentElement.style.scrollbarGutter = previousGutter;
		menuToggle.setAttribute("aria-expanded", "false");
		if (mobileViewport.matches) menuToggle.focus({ preventScroll: true });
	});
	menu.addEventListener("keydown", (event) => {
		if (event.key !== "Tab") return;
		const controls = [...menu.querySelectorAll("a[href], button:not([disabled])")].filter(
			(element) => element.getClientRects().length > 0,
		);
		const first = controls[0];
		const last = controls.at(-1);
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	});
	menu.addEventListener("click", (event) => {
		if (event.target.closest("a[href]")) closeMenu();
	});
	mobileViewport.addEventListener("change", () => {
		if (!mobileViewport.matches) closeMenu();
	});
	window.addEventListener("pagehide", closeMenu);
}
