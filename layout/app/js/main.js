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

	if (!open) setDropdown(false);

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


// Custom select (SlimSelect from libs.min.js). The native <select> stays in the
// form as the value holder; the library renders its control right next to it.

const serviceSelect = document.getElementById("service");

function setServiceError(isError) {
	const field = serviceSelect ? serviceSelect.closest(".form-card__field") : null;
	const slimMain = field ? field.querySelector(".ss-main") : null;

	if (!slimMain) return;

	slimMain.setAttribute("aria-invalid", isError ? "true" : "false");

	if (isError) slimMain.focus();
}

const serviceSelectControl = window.SlimSelect && serviceSelect
	? new window.SlimSelect({
		select: serviceSelect,
		settings: {
			showSearch: false,
			allowDeselect: false
		},
		events: {
			afterChange: function () {
				setServiceError(false);
			}
		}
	})
	: null;


// Header services dropdown. Desktop opens on hover/focus and click; below the
// nav breakpoint the same markup becomes an inline accordion in the mobile menu.

const servicesDropdown = document.querySelector(".header__nav-item--has-dropdown");
const servicesDropdownToggle = servicesDropdown
	? servicesDropdown.querySelector(".header__dropdown-toggle")
	: null;
const servicesDropdownLinks = servicesDropdown
	? servicesDropdown.querySelectorAll(".header__dropdown-link")
	: [];
const dropdownHoverQuery = window.matchMedia("(min-width: 901px) and (hover: hover) and (pointer: fine)");

let dropdownCloseTimer;
let viewportIsDesktop = window.innerWidth > MENU_BREAKPOINT;

function isDropdownOpen() {
	return servicesDropdown ? servicesDropdown.classList.contains("is-open") : false;
}

function setDropdown(open) {
	if (!servicesDropdown || !servicesDropdownToggle) return;

	clearTimeout(dropdownCloseTimer);

	servicesDropdown.classList.toggle("is-open", open);
	servicesDropdownToggle.setAttribute("aria-expanded", open ? "true" : "false");
}

if (servicesDropdown && servicesDropdownToggle) {
	servicesDropdownToggle.addEventListener("click", function () {
		setDropdown(!isDropdownOpen());
	});

	servicesDropdown.addEventListener("mouseenter", function () {
		if (dropdownHoverQuery.matches) setDropdown(true);
	});

	servicesDropdown.addEventListener("mouseleave", function () {
		if (!dropdownHoverQuery.matches) return;

		clearTimeout(dropdownCloseTimer);
		dropdownCloseTimer = setTimeout(function () {
			if (!servicesDropdown.contains(document.activeElement)) setDropdown(false);
		}, 150);
	});

	servicesDropdown.addEventListener("focusout", function (event) {
		if (!servicesDropdown.contains(event.relatedTarget)) setDropdown(false);
	});

	document.addEventListener("click", function (event) {
		if (isDropdownOpen() && !servicesDropdown.contains(event.target)) setDropdown(false);
	});

	document.addEventListener("keydown", function (event) {
		if (event.key === "Escape" && isDropdownOpen()) {
			setDropdown(false);
			servicesDropdownToggle.focus();
		}
	});

	// Choosing a service pre-selects it in the booking form and closes the panel

	servicesDropdownLinks.forEach(function (link) {
		link.addEventListener("click", function () {
			const serviceName = link.getAttribute("data-service");

			if (serviceSelect && serviceName) {
				if (serviceSelectControl) {
					serviceSelectControl.setSelected(serviceName);
				} else {
					serviceSelect.value = serviceName;
				}
			}

			setDropdown(false);
		});
	});

	window.addEventListener("resize", function () {
		const isDesktop = window.innerWidth > MENU_BREAKPOINT;

		if (isDesktop === viewportIsDesktop) return;

		viewportIsDesktop = isDesktop;
		setDropdown(false);
	});
}


// Booking form (preview only)

const form = document.getElementById("booking-form");
const statusElement = document.getElementById("form-status");

if (form && statusElement) {
	form.addEventListener("submit", function (event) {
		event.preventDefault();

		if (!form.checkValidity()) {
			// the native <select> is hidden by SlimSelect, so browsers cannot
			// anchor a validation bubble to it — flag the custom control instead
			if (serviceSelect && !serviceSelect.checkValidity()) setServiceError(true);

			const invalidControl = form.querySelector(":invalid:not(select)");

			if (invalidControl) invalidControl.reportValidity();

			return;
		}

		statusElement.hidden = false;
		statusElement.textContent = "This preview form is not connected yet. Call (619) 555-0142 and we will book you in directly.";
		statusElement.focus();
	});
}


// FAQ accordion (buttons instead of details/summary so the answer can animate).
// Only one answer stays open: opening an item closes the rest.
// While answers change height the clicked question is pinned to its viewport position,
// so collapsing another card never scrolls the page under the cursor.

const FAQ_PIN_DURATION = 240; // --motion-base (200ms) plus one frame

const faqQuestions = document.querySelectorAll(".faq__question");

function closeFaqItem(faqItem) {
	faqItem.classList.remove("is-open");

	const question = faqItem.querySelector(".faq__question");

	if (question) question.setAttribute("aria-expanded", "false");
}

function pinQuestionWhileAnimating(question, toggle) {
	const root = document.documentElement;
	const startTop = question.getBoundingClientRect().top;
	const startedAt = performance.now();

	// html has scroll-behavior: smooth, which would turn every 1px correction into a scroll
	const previousBehavior = root.style.scrollBehavior;

	root.style.scrollBehavior = "auto";

	toggle();

	function syncScroll() {
		const offset = question.getBoundingClientRect().top - startTop;

		if (offset) window.scrollBy(0, offset);

		if (performance.now() - startedAt < FAQ_PIN_DURATION) {
			requestAnimationFrame(syncScroll);
			return;
		}

		root.style.scrollBehavior = previousBehavior;
	}

	requestAnimationFrame(syncScroll);
}

faqQuestions.forEach(function (question) {
	const faqItem = question.closest(".faq__item");

	if (!faqItem) return;

	question.addEventListener("click", function () {
		const isOpen = !faqItem.classList.contains("is-open");

		pinQuestionWhileAnimating(question, function () {
			faqQuestions.forEach(function (otherQuestion) {
				const otherItem = otherQuestion.closest(".faq__item");

				if (otherItem && otherItem !== faqItem) closeFaqItem(otherItem);
			});

			if (!isOpen) {
				closeFaqItem(faqItem);
				return;
			}

			faqItem.classList.add("is-open");
			question.setAttribute("aria-expanded", "true");
		});
	});
});


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
}


// Cases filter (repairs page). The buttons are a toggle group, not ARIA tabs:
// "All" and every appliance category filter the same gallery in place, so the
// tiles keep their single source of markup. Hidden tiles drop out of tab order.

// Switching filters changes the gallery height, and the browser's scroll
// anchoring would try to compensate by moving the page. The click locks the
// scroll offset for the next two frames instead, so the viewport stays exactly
// where the visitor was when they picked a category.

function lockCasesScroll() {
	const savedScrollY = window.scrollY;
	const root = document.documentElement;
	const previousBehavior = root.style.scrollBehavior;

	root.style.scrollBehavior = "auto";

	function restore() {
		if (Math.abs(window.scrollY - savedScrollY) > 0.5) window.scrollTo(0, savedScrollY);
	}

	requestAnimationFrame(function () {
		restore();

		requestAnimationFrame(function () {
			restore();
			root.style.scrollBehavior = previousBehavior;
		});
	});
}

const casesFilters = document.querySelectorAll(".cases__tabs");

casesFilters.forEach(function (group) {
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
			lockCasesScroll();
			applyCasesFilter(button.getAttribute("data-cases-filter") || "all");
		});
	});
});


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
