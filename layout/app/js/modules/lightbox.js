// FsLightbox (libs.min.js) scans the document on its own and groups every
// anchor with a data-fslightbox value into a gallery named by that value.
// A gallery with a single source opens as one photo, without slider arrows,
// which is what the case tiles use.
//
// While a photo is open the plug-in hides the page scrollbar by adding a class
// to <html>, so the viewport gets wider and every centred block moves. Its own
// compensation — a margin on <body> — cannot work here: <body> is width:100%
// in the reset, so the margin is clipped away, and fixed elements (header,
// mobile sticky bar) ignore body margins anyway. The module therefore tracks
// open and close itself, publishes the real scrollbar width, and
// components/lightbox.scss reserves the gutter from that value.

const PLUGIN_OPEN_CLASS = "fslightbox-open";
const OPEN_CLASS = "is-lightbox-open";

// Measured with a probe, not from the document: by the time the state class
// appears the root scrollbar is already hidden and clientWidth is misleading.
function getScrollbarWidth() {
	const probe = document.createElement("div");

	probe.style.cssText = "position:absolute;top:-9999px;width:100px;overflow:scroll";

	document.body.appendChild(probe);

	const width = probe.offsetWidth - probe.clientWidth;

	probe.remove();

	return width;
}

export function initLightbox() {
	if (typeof window.refreshFsLightbox !== "function") return;

	const links = Array.from(document.querySelectorAll("[data-fslightbox]"));

	if (!links.length) return;

	// A shared key would turn the tiles into a slider: give each tile its own.
	const groups = {};

	links.forEach(function (link, index) {
		const key = link.getAttribute("data-fslightbox") || "case";

		groups[key] = (groups[key] || 0) + 1;

		if (groups[key] > 1) link.setAttribute("data-fslightbox", key + "-" + index);
	});

	window.refreshFsLightbox();

	const root = document.documentElement;
	let isOpen = false;

	function syncLightboxState() {
		const nextIsOpen = root.classList.contains(PLUGIN_OPEN_CLASS);

		if (nextIsOpen === isOpen) return;

		isOpen = nextIsOpen;

		root.classList.toggle(OPEN_CLASS, isOpen);

		if (!isOpen) {
			root.style.removeProperty("--scrollbar-width");

			return;
		}

		root.style.setProperty("--scrollbar-width", getScrollbarWidth() + "px");
	}

	// The plug-in toggles its class only when a photo is opened or closed, so the
	// observer stays idle the rest of the time.
	new MutationObserver(syncLightboxState).observe(root, {
		attributes: true,
		attributeFilter: ["class"]
	});

	// A page restored from the back/forward cache can come back already open.
	syncLightboxState();
}
