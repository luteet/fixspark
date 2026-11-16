import { lockScrollPosition } from "./utils.js";

// Cases filter (repairs page). The buttons are a toggle group, not ARIA tabs:
// "All" and every appliance category filter the same gallery in place, so the
// tiles keep their single source of markup. Hidden tiles drop out of tab order.

export function initCasesFilter() {
	document.querySelectorAll(".cases__tabs").forEach(function (group) {
		const filterButtons = Array.from(group.querySelectorAll(".cases__tab"));
		const tiles = Array.from(group.querySelectorAll(".case-tile"));
		const status = group.querySelector("[data-cases-status]");

		if (!filterButtons.length || !tiles.length) return;

		function applyCasesFilter(filter) {
			let visible = 0;

			filterButtons.forEach(function (button) {
				const isActive = button.getAttribute("data-cases-filter") === filter;

				button.setAttribute("aria-pressed", isActive ? "true" : "false");
			});

			tiles.forEach(function (tile) {
				const matches = filter === "all" || tile.getAttribute("data-cases-category") === filter;

				tile.hidden = !matches;

				if (matches) visible++;
			});

			if (status) {
				status.textContent = visible + (visible === 1 ? " case shown" : " cases shown");
			}
		}

		filterButtons.forEach(function (button) {
			button.addEventListener("click", function () {
				lockScrollPosition();
				applyCasesFilter(button.getAttribute("data-cases-filter") || "all");
			});
		});
	});
}
