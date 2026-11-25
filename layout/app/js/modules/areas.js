// Highlights the area card that matches the current local page.
// A page opts in by putting data-current-area="<slug>" on a container
// (usually <main>); the slug matches a data-area value inside .areas.

export function initAreas() {
	const scope = document.querySelector(".areas");
	const page = document.querySelector("[data-current-area]");

	if (!scope || !page) return;

	const slug = page.dataset.currentArea;
	if (!slug) return;

	const cards = scope.querySelectorAll("[data-area]");
	const current = Array.from(cards).find(card => card.dataset.area === slug);

	if (!current) return;

	current.classList.add("is-current");

	if (current.matches("a")) {
		current.setAttribute("aria-current", "page");
	}
}
