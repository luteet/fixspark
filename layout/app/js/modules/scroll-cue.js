// Scroll cue arrows (scroll-cue.min.js is bundled into libs.min.js)

export function initScrollCue() {
	if (typeof window.ScrollCue !== "function") return;

	new window.ScrollCue({
		anchorContainer: "section, .header, .footer",
		at: -600,
		delay: 0
	}).init();
}
