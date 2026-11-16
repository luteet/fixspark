import { reduceMotion } from "./utils.js";

// In-page anchor links. One delegated listener covers every link on every page:
// a click is taken over only when the link resolves to the current document and
// the id it names exists here — then the hash is pushed into the URL and the
// section is scrolled to smoothly. Everything else (links to other pages,
// tel:/mailto:, modified clicks, anchors with no matching section) falls through
// to the browser's default behaviour untouched.

const FOCUSABLE_SELECTOR = "a[href], button, input, select, textarea, [tabindex]:not([tabindex=\"-1\"])";

// "/index.html" and "/" are the same document; trailing slashes do not matter

function normalizeDocumentPath(pathname) {
	const withoutIndex = pathname.replace(/index\.html$/, "");
	const withoutTrailingSlash = withoutIndex.replace(/\/+$/, "");

	return withoutTrailingSlash || "/";
}

// Scrolling alone would leave keyboard and screen reader users at the top of the
// document (the skip link depends on the focus moving), so the target is focused
// without a second scroll and drops the temporary tabindex once it loses focus.

function focusAnchorTarget(target) {
	const isFocusable = target.matches(FOCUSABLE_SELECTOR);

	if (!isFocusable) target.setAttribute("tabindex", "-1");

	target.focus({ preventScroll: true });

	if (isFocusable) return;

	if (document.activeElement !== target) {
		target.removeAttribute("tabindex");
		return;
	}

	target.addEventListener("blur", function () {
		target.removeAttribute("tabindex");
	}, { once: true });
}

export function initAnchorLinks() {
	document.addEventListener("click", function (event) {
		if (event.defaultPrevented || event.button !== 0) return;
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
		if (!(event.target instanceof Element)) return;

		const link = event.target.closest("a[href]");

		if (!link) return;

		// another tab/window and file downloads stay with the browser
		if (link.target && link.target !== "_self") return;
		if (link.hasAttribute("download")) return;

		let linkUrl;

		try {
			linkUrl = new URL(link.href, window.location.href);
		} catch (error) {
			return;
		}

		if (!linkUrl.hash || linkUrl.hash === "#") return;
		if (linkUrl.origin !== window.location.origin) return;
		if (normalizeDocumentPath(linkUrl.pathname) !== normalizeDocumentPath(window.location.pathname)) return;

		let id = linkUrl.hash.slice(1);

		try {
			id = decodeURIComponent(id);
		} catch (error) {
			return;
		}

		const target = document.getElementById(id);

		// no section for the hash — the browser keeps the link as it is
		if (!target) return;

		event.preventDefault();

		if (window.location.hash !== linkUrl.hash) window.history.pushState(null, "", linkUrl.href);

		target.scrollIntoView({
			behavior: reduceMotion ? "auto" : "smooth",
			block: "start",
			inline: "nearest"
		});

		focusAnchorTarget(target);
	});
}
