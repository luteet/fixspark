import { setMenu } from "./header.js";
import { closeDropdowns } from "./header-dropdowns.js";

// Cross-document View Transitions (styles live in components/view-transition.scss).
// The fixed header and sticky bar are kept out of the swap: the outgoing document
// hides them here, the incoming one keeps them hidden until the cross-fade ends.
// `pageswap` fires right before the old page is snapshotted and `pagereveal` right
// before the new one is, so states that are still animating shut — an open mobile
// menu, an open header dropdown — never land in the frame half-closed.

const html = document.documentElement;

const CHROME_HIDDEN = "is-chrome-hidden";
const CHROME_REVEAL_FALLBACK = 1200;

let activeViewTransition = null;

// `is-leaving` and `is-chrome-hidden` only make sense for the duration of a
// single navigation. A document restored from the back/forward cache keeps the
// classes it was frozen with, while the transition that should have revealed
// the chrome ran on the other side of that navigation — so the header would
// stay at opacity 0 (and `.is-leaving *` even kills every transition). Both
// states are cleared before the next reveal and on any cached restore.

function clearChromeState() {
	html.classList.remove("is-leaving");
	html.classList.remove(CHROME_HIDDEN);
}

export function initViewTransition() {
	window.addEventListener("pageswap", function (event) {
		if (!event.viewTransition) return;

		html.classList.add("is-leaving");
		setMenu(false);
		closeDropdowns();
	});

	window.addEventListener("pagereveal", function (event) {
		html.classList.remove("is-leaving");

		if (!event.viewTransition) {
			html.classList.remove(CHROME_HIDDEN);
			return;
		}

		const viewTransition = event.viewTransition;

		activeViewTransition = viewTransition;
		html.classList.add(CHROME_HIDDEN);

		function revealChrome() {
			if (activeViewTransition === viewTransition) activeViewTransition = null;

			html.classList.remove(CHROME_HIDDEN);
		}

		viewTransition.finished.then(revealChrome, revealChrome);

		// safety net: a skipped or cancelled transition must never leave the header
		// hidden for good
		setTimeout(revealChrome, CHROME_REVEAL_FALLBACK);
	});

	// Back/forward navigation may restore the frozen document instead of loading a
	// fresh one. When no transition is mid-flight the chrome is forced back on, so
	// going Back always ends with a visible header.

	window.addEventListener("pageshow", function (event) {
		if (!event.persisted || activeViewTransition) return;

		clearChromeState();
	});
}
