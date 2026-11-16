// Shared constants and helpers used by more than one page module.

// Must match the mobile navigation breakpoint in the SCSS (900px)
export const MENU_BREAKPOINT = 900;

export const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Switching filters (cases, FAQ topics) changes the document height, and the
// browser's scroll anchoring would try to compensate by moving the page. The
// click locks the scroll offset for the next two frames instead, so the viewport
// stays exactly where the visitor was when they picked a category.

export function lockScrollPosition() {
	const savedScrollY = window.scrollY;
	const root = document.documentElement;
	const previousBehavior = root.style.scrollBehavior;

	root.style.scrollBehavior = "auto";

	function restore() {
		if (Math.abs(window.scrollY - savedScrollY) > 0.5) window.scrollTo(0, savedScrollY);
	}

	requestAnimationFrame(function () {
		restore();

		requestAnimationFrame(function () {
			restore();
			root.style.scrollBehavior = previousBehavior;
		});
	});
}
