import { MENU_BREAKPOINT } from "./utils.js";
import { closeDropdowns } from "./header-dropdowns.js";

const body = document.body;
const html = document.documentElement;
const header = document.querySelector(".header");
const burger = document.querySelector(".header__burger");
const nav = document.querySelector(".header__nav");
const navLinks = document.querySelectorAll(".header__nav a");

export function isMenuOpen() {
	return body.classList.contains("is-mobile-nav-active");
}

export function setMenu(open) {
	if (!burger || !nav) return;

	burger.classList.toggle("is-mobile-nav-active", open);
	nav.classList.toggle("is-mobile-nav-active", open);
	body.classList.toggle("is-mobile-nav-active", open);
	header && header.classList.toggle("header--menu-open", open);

	if (!open) closeDropdowns();

	burger.setAttribute("aria-expanded", open ? "true" : "false");
	burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

// Header — solid background after scroll

function onScroll() {
	header && header.classList.toggle("header--scrolled", window.scrollY > 8);
}

// Viewport units + header height

function resize() {
	header && html.style.setProperty("--height-header", header.offsetHeight + "px");
	html.style.setProperty("--vh", (window.innerHeight * 0.01).toFixed(2) + "px");
}

export function initHeader() {
	onScroll();
	window.addEventListener("scroll", onScroll, { passive: true });

	// Mobile navigation

	burger && burger.addEventListener("click", function () {
		setMenu(!isMenuOpen());
	});

	navLinks.forEach(function (link) {
		link.addEventListener("click", function () {
			if (isMenuOpen()) setMenu(false);
		});
	});

	document.addEventListener("keydown", function (event) {
		if (event.key === "Escape" && isMenuOpen()) {
			setMenu(false);
			burger && burger.focus();
		}
	});

	window.addEventListener("resize", function () {
		if (window.innerWidth > MENU_BREAKPOINT && isMenuOpen()) setMenu(false);
	});

	resize();
	window.addEventListener("resize", resize);
}
