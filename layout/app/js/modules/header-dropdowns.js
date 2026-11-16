import { MENU_BREAKPOINT } from "./utils.js";
import { selectService } from "./booking-form.js";

// Header dropdowns (services, brands). Desktop opens on hover/focus and click;
// below the nav breakpoint the same markup becomes an inline accordion in the
// mobile menu. Only one panel is open at a time.

const dropdownItems = document.querySelectorAll(".header__nav-item--has-dropdown");
const dropdownHoverQuery = window.matchMedia("(min-width: 901px) and (hover: hover) and (pointer: fine)");
const dropdownCloseTimers = new WeakMap();

let viewportIsDesktop = window.innerWidth > MENU_BREAKPOINT;

function setDropdown(item, open) {
	const toggle = item ? item.querySelector(".header__dropdown-toggle") : null;

	if (!item || !toggle) return;

	clearTimeout(dropdownCloseTimers.get(item));

	item.classList.toggle("is-open", open);
	toggle.setAttribute("aria-expanded", open ? "true" : "false");
}

export function closeDropdowns() {
	dropdownItems.forEach(function (item) {
		setDropdown(item, false);
	});
}

export function initHeaderDropdowns() {
	dropdownItems.forEach(function (item) {
		const toggle = item.querySelector(".header__dropdown-toggle");
		const links = item.querySelectorAll(".header__dropdown-link");

		if (!toggle) return;

		toggle.addEventListener("click", function () {
			const isOpen = item.classList.contains("is-open");

			closeDropdowns();
			setDropdown(item, !isOpen);
		});

		item.addEventListener("mouseenter", function () {
			if (!dropdownHoverQuery.matches) return;

			closeDropdowns();
			setDropdown(item, true);
		});

		item.addEventListener("mouseleave", function () {
			if (!dropdownHoverQuery.matches) return;

			clearTimeout(dropdownCloseTimers.get(item));

			dropdownCloseTimers.set(item, setTimeout(function () {
				if (!item.contains(document.activeElement)) setDropdown(item, false);
			}, 150));
		});

		item.addEventListener("focusout", function (event) {
			if (!item.contains(event.relatedTarget)) setDropdown(item, false);
		});

		// Choosing a service pre-selects it in the booking form and closes the panel

		links.forEach(function (link) {
			link.addEventListener("click", function () {
				selectService(link.getAttribute("data-service"));

				setDropdown(item, false);
			});
		});
	});

	document.addEventListener("click", function (event) {
		dropdownItems.forEach(function (item) {
			if (!item.contains(event.target)) setDropdown(item, false);
		});
	});

	document.addEventListener("keydown", function (event) {
		if (event.key !== "Escape") return;

		dropdownItems.forEach(function (item) {
			if (!item.classList.contains("is-open")) return;

			const toggle = item.querySelector(".header__dropdown-toggle");

			setDropdown(item, false);

			if (toggle) toggle.focus();
		});
	});

	window.addEventListener("resize", function () {
		const isDesktop = window.innerWidth > MENU_BREAKPOINT;

		if (isDesktop === viewportIsDesktop) return;

		viewportIsDesktop = isDesktop;
		closeDropdowns();
	});
}
