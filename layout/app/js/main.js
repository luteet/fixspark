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


// Hero title word slider (vertical, Swiper from libs.min.js)

const heroWordSlider = document.querySelector(".hero__title-slider");

if (window.Swiper && heroWordSlider) {
	new Swiper(heroWordSlider, {
		direction: "vertical",
		loop: true,
		speed: reduceMotion ? 0 : 500,
		autoplay: reduceMotion ? false : {
			delay: 2000,
			disableOnInteraction: false,
			pauseOnMouseEnter: true
		},
		allowTouchMove: false,
		a11y: { enabled: false }
	});
}


// Booking form (preview only)

const form = document.getElementById("booking-form");
const statusElement = document.getElementById("form-status");

if (form && statusElement) {
	form.addEventListener("submit", function (event) {
		event.preventDefault();

		if (!form.checkValidity()) {
			form.reportValidity();
			return;
		}

		statusElement.hidden = false;
		statusElement.textContent = "This preview form is not connected yet. Call (619) 555-0142 and we will book you in directly.";
		statusElement.focus();
	});
}


// Services list — Swiper fade preview synced with the hovered/focused row

const servicesList = document.querySelector(".services__list");
const servicesSlider = document.querySelector(".services__frame");
const servicesLinks = servicesList ? servicesList.querySelectorAll(".services__link") : [];

let servicesSwiper = null;

if (window.Swiper && servicesSlider) {
	servicesSwiper = new Swiper(servicesSlider, {
		effect: "fade",
		fadeEffect: {
			crossFade: true
		},
		speed: reduceMotion ? 0 : 400,
		allowTouchMove: false,
		watchSlidesProgress: true,
		a11y: { enabled: false }
	});
}

function showServiceSlide(index) {
	servicesLinks.forEach(function (link, linkIndex) {
		link.classList.toggle("is-active", linkIndex === index);
	});

	if (servicesSwiper) servicesSwiper.slideTo(index);
}

if (servicesLinks.length) {
	servicesLinks.forEach(function (link, index) {
		link.addEventListener("mouseenter", function () {
			showServiceSlide(index);
		});

		link.addEventListener("focus", function () {
			showServiceSlide(index);
		});
	});

	servicesList && servicesList.addEventListener("mouseleave", function () {
		showServiceSlide(0);
	});
}


// Aspect ratio for images

const imageAspectRatio = document.querySelectorAll(".image-aspect-ratio, figure img");

imageAspectRatio.forEach(function (image) {
	const width = image.getAttribute("width");
	const height = image.getAttribute("height");

	if (width && height) image.style.setProperty("--aspect-ratio", width + " / " + height);
});


// Benefits marquee — repeat the group so the loop never shows a gap

const marquee = document.querySelector(".marquee");
const marqueeTrack = document.querySelector(".marquee__track");
const marqueeGroup = marqueeTrack && marqueeTrack.querySelector(".marquee__group");

let marqueeTimer;

function buildMarquee() {
	if (!marquee || !marqueeTrack || !marqueeGroup) return;

	marqueeTrack.querySelectorAll(".marquee__group").forEach(function (group, index) {
		if (index > 0) group.remove();
	});

	const groupWidth = marqueeGroup.offsetWidth;

	if (!groupWidth) return;

	// the track is shifted by half of its width, so both halves must be at
	// least one viewport wide and hold the same number of groups
	// (2.2 instead of 2 is a safety margin for a late webfont swap)
	const needed = Math.max(2, Math.ceil((marquee.offsetWidth * 2.2) / groupWidth));
	const total = needed % 2 === 0 ? needed : needed + 1;

	for (let index = 1; index < total; index++) {
		const clone = marqueeGroup.cloneNode(true);

		clone.setAttribute("aria-hidden", "true");
		marqueeTrack.append(clone);
	}

	// constant speed: ~45px per second regardless of the screen width
	const halfWidth = (groupWidth * total) / 2;
	marqueeTrack.style.setProperty("--marquee-duration", Math.max(32, Math.round(halfWidth / 45)) + "s");
}

buildMarquee();
window.addEventListener("load", buildMarquee);

window.addEventListener("resize", function () {
	clearTimeout(marqueeTimer);
	marqueeTimer = setTimeout(buildMarquee, 150);
});


// Viewport units + header height

function resize() {
	header && html.style.setProperty("--height-header", header.offsetHeight + "px");
	html.style.setProperty("--vh", (window.innerHeight * 0.01).toFixed(2) + "px");
}

resize();
window.addEventListener("resize", resize);
