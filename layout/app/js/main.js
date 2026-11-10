const body = document.body;
const html = document.documentElement;
const header = document.querySelector(".header");
const burger = document.querySelector(".header__burger");
const nav = document.querySelector(".header__nav");
const navLinks = document.querySelectorAll(".header__nav a");


// Header — solid background after scroll

const MENU_BREAKPOINT = 900;

function onScroll() {
	header && header.classList.toggle("header--scrolled", window.scrollY > 8);
}

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });


// Mobile navigation

function isMenuOpen() {
	return body.classList.contains("is-mobile-nav-active");
}

function setMenu(open) {
	if (!burger || !nav) return;

	burger.classList.toggle("is-mobile-nav-active", open);
	nav.classList.toggle("is-mobile-nav-active", open);
	body.classList.toggle("is-mobile-nav-active", open);
	header && header.classList.toggle("header--menu-open", open);

	burger.setAttribute("aria-expanded", open ? "true" : "false");
	burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

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


// Reviews slider (Swiper from libs.min.js)

const reviewsSwiper = document.querySelector(".reviews__swiper");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (window.Swiper && reviewsSwiper) {
	new Swiper(".reviews__swiper", {
		loop: true,
		speed: reduceMotion ? 0 : 400,
		spaceBetween: 24,
		slidesPerView: 1,
		grabCursor: true,
		a11y: {
			prevSlideMessage: "Previous reviews",
			nextSlideMessage: "Next reviews",
			paginationBulletMessage: "Go to review {{index}}"
		},
		pagination: {
			el: ".reviews__pagination",
			clickable: true
		},
		navigation: {
			prevEl: ".reviews__prev",
			nextEl: ".reviews__next"
		},
		breakpoints: {
			640: { slidesPerView: 2, spaceBetween: 24 },
			1024: { slidesPerView: 3, spaceBetween: 24 }
		}
	});
}


// Booking form (preview only)

const form = document.getElementById("booking-form");
const status = document.getElementById("form-status");

if (form && status) {
	form.addEventListener("submit", function (event) {
		event.preventDefault();

		if (!form.checkValidity()) {
			form.reportValidity();
			return;
		}

		status.hidden = false;
		status.textContent = "This preview form is not connected yet. Call (619) 555-0142 and we will book you in directly.";
		status.focus();
	});
}


// Aspect ratio for images

const imageAspectRatio = document.querySelectorAll(".image-aspect-ratio, figure img");

imageAspectRatio.forEach(function (image) {
	const width = image.getAttribute("width");
	const height = image.getAttribute("height");

	if (width && height) image.style.setProperty("--aspect-ratio", width + " / " + height);
});


// Viewport units + header height

function resize() {
	header && html.style.setProperty("--height-header", header.offsetHeight + "px");
	html.style.setProperty("--vh", (window.innerHeight * 0.01).toFixed(2) + "px");
}

resize();
window.addEventListener("resize", resize);
