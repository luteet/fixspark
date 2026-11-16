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

	if (!open) closeDropdowns();

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


// Service page: preselect the page's own service in the booking form.
// The page opts in with data-preselect-service="<option label>" on <main>.

const preselectRoot = document.querySelector("[data-preselect-service]");

if (serviceSelect && preselectRoot) {
	const preselectName = preselectRoot.getAttribute("data-preselect-service");

	if (preselectName) {
		if (serviceSelectControl) {
			serviceSelectControl.setSelected(preselectName);
		} else {
			serviceSelect.value = preselectName;
		}
	}
}


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

function closeDropdowns() {
	dropdownItems.forEach(function (item) {
		setDropdown(item, false);
	});
}

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
			const serviceName = link.getAttribute("data-service");

			if (serviceSelect && serviceName) {
				if (serviceSelectControl) {
					serviceSelectControl.setSelected(serviceName);
				} else {
					serviceSelect.value = serviceName;
				}
			}

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


// FAQ page — topic filter, search and pagination. The markup carries the full
// list, so without JS every question stays readable; the script only narrows
// what is visible. Pagination is built here because the page count depends on
// the active topic and the search query.

const FAQ_PER_PAGE = 8;

document.querySelectorAll("[data-faq-page]").forEach(function (faqPage) {
	const pageSize = parseInt(faqPage.getAttribute("data-faq-page"), 10) || FAQ_PER_PAGE;
	const tabs = Array.from(faqPage.querySelectorAll("[data-faq-tab]"));
	const search = faqPage.querySelector("[data-faq-search]");
	const items = Array.from(faqPage.querySelectorAll("[data-faq-item]"));
	const list = faqPage.querySelector("[data-faq-list]");
	const pagination = faqPage.querySelector("[data-faq-pagination]");
	const empty = faqPage.querySelector("[data-faq-empty]");
	const status = faqPage.querySelector("[data-faq-status]");

	if (!items.length) return;

	const state = { filter: "all", query: "", page: 1 };

	function normalize(value) {
		return value.toLowerCase().replace(/\s+/g, " ").trim();
	}

	function matchesFilter(item) {
		if (state.filter !== "all" && item.getAttribute("data-faq-category") !== state.filter) return false;
		if (!state.query) return true;

		return normalize(item.textContent).includes(state.query);
	}

	function closeOpenItems() {
		items.forEach(function (item) {
			if (item.classList.contains("is-open")) closeFaqItem(item);
		});
	}

	// Moving between pages changes the list height under the pagination, so the
	// list is brought back to the top of the viewport explicitly.

	function scrollToList() {
		if (!list) return;

		list.scrollIntoView({
			block: "start",
			behavior: reduceMotion ? "auto" : "smooth"
		});
	}

	function renderPagination(totalPages) {
		if (!pagination) return;

		pagination.textContent = "";
		pagination.hidden = totalPages < 2;

		if (totalPages < 2) return;

		const previous = document.createElement("button");

		previous.type = "button";
		previous.className = "faq-page__page";
		previous.textContent = "Previous";
		previous.setAttribute("data-faq-step", "-1");
		previous.disabled = state.page === 1;
		pagination.append(previous);

		for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
			const button = document.createElement("button");

			button.type = "button";
			button.className = "faq-page__page";
			button.textContent = String(pageNumber);
			button.setAttribute("data-faq-page-to", String(pageNumber));

			if (pageNumber === state.page) button.setAttribute("aria-current", "page");

			pagination.append(button);
		}

		const next = document.createElement("button");

		next.type = "button";
		next.className = "faq-page__page";
		next.textContent = "Next";
		next.setAttribute("data-faq-step", "1");
		next.disabled = state.page === totalPages;
		pagination.append(next);
	}

	function render() {
		const matched = items.filter(matchesFilter);
		const totalPages = Math.max(1, Math.ceil(matched.length / pageSize));

		if (state.page > totalPages) state.page = totalPages;

		const start = (state.page - 1) * pageSize;
		const pageItems = matched.slice(start, start + pageSize);

		items.forEach(function (item) {
			item.hidden = true;
		});

		pageItems.forEach(function (item) {
			item.hidden = false;
		});

		if (empty) empty.hidden = matched.length > 0;

		tabs.forEach(function (tab) {
			const isActive = tab.getAttribute("data-faq-filter") === state.filter;

			tab.setAttribute("aria-pressed", isActive ? "true" : "false");
		});

		renderPagination(totalPages);

		if (status) {
			status.textContent = matched.length
				? matched.length + (matched.length === 1 ? " question shown" : " questions shown") +
					", page " + state.page + " of " + totalPages
				: "No questions match the search.";
		}
	}

	// A topic change or a narrower search shrinks the list, and the browser's
	// scroll anchoring would compensate by moving the page. The same scroll lock
	// the cases filter uses keeps the toolbar exactly where the visitor clicked.

	tabs.forEach(function (tab) {
		tab.addEventListener("click", function () {
			state.filter = tab.getAttribute("data-faq-filter") || "all";
			state.page = 1;

			lockScrollPosition();
			closeOpenItems();
			render();
		});
	});

	if (search) {
		search.addEventListener("input", function () {
			state.query = normalize(search.value);
			state.page = 1;

			lockScrollPosition();
			closeOpenItems();
			render();
		});
	}

	if (pagination) {
		pagination.addEventListener("click", function (event) {
			const button = event.target.closest("button");

			if (!button || button.disabled) return;

			const step = button.getAttribute("data-faq-step");
			const pageTo = button.getAttribute("data-faq-page-to");

			if (step) {
				state.page += parseInt(step, 10);
			} else if (pageTo) {
				state.page = parseInt(pageTo, 10);
			} else {
				return;
			}

			const keepFocus = pagination.contains(document.activeElement);

			closeOpenItems();
			render();
			scrollToList();

			// the buttons are rebuilt on every render, so the focused page button
			// is a new node — move focus to it instead of dropping it to <body>
			if (keepFocus) {
				const currentPage = pagination.querySelector("[aria-current=\"page\"]");

				if (currentPage) currentPage.focus({ preventScroll: true });
			}
		});
	}

	render();
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

// Switching filters (cases, FAQ topics) changes the document height, and the
// browser's scroll anchoring would try to compensate by moving the page. The
// click locks the scroll offset for the next two frames instead, so the viewport
// stays exactly where the visitor was when they picked a category.

function lockScrollPosition() {
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
			lockScrollPosition();
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


// Cross-document View Transitions (styles live in components/view-transition.scss).
// The fixed header and sticky bar are kept out of the swap: the outgoing document
// hides them here, the incoming one keeps them hidden until the cross-fade ends.
// `pageswap` fires right before the old page is snapshotted and `pagereveal` right
// before the new one is, so states that are still animating shut — an open mobile
// menu, an open header dropdown — never land in the frame half-closed.

const CHROME_HIDDEN = "is-chrome-hidden";
const CHROME_REVEAL_FALLBACK = 1200;

let activeViewTransition = null;

// `is-leaving` and `is-chrome-hidden` only make sense for the duration of a
// single navigation. A document restored from the back/forward cache keeps the
// classes it was frozen with, while the transition that should have revealed
// the chrome ran on the other side of that navigation — so the header would
// stay at opacity 0 (and `.is-leaving *` even kills every transition). Both
// states are cleared before the next reveal and on any cached restore.

function clearChromeState() {
	html.classList.remove("is-leaving");
	html.classList.remove(CHROME_HIDDEN);
}

window.addEventListener("pageswap", function (event) {
	if (!event.viewTransition) return;

	html.classList.add("is-leaving");
	setMenu(false);
	closeDropdowns();
});

window.addEventListener("pagereveal", function (event) {
	html.classList.remove("is-leaving");

	if (!event.viewTransition) {
		html.classList.remove(CHROME_HIDDEN);
		return;
	}

	const viewTransition = event.viewTransition;

	activeViewTransition = viewTransition;
	html.classList.add(CHROME_HIDDEN);

	function revealChrome() {
		if (activeViewTransition === viewTransition) activeViewTransition = null;

		html.classList.remove(CHROME_HIDDEN);
	}

	viewTransition.finished.then(revealChrome, revealChrome);

	// safety net: a skipped or cancelled transition must never leave the header
	// hidden for good
	setTimeout(revealChrome, CHROME_REVEAL_FALLBACK);
});

// Back/forward navigation may restore the frozen document instead of loading a
// fresh one. When no transition is mid-flight the chrome is forced back on, so
// going Back always ends with a visible header.

window.addEventListener("pageshow", function (event) {
	if (!event.persisted || activeViewTransition) return;

	clearChromeState();
});


// Viewport units + header height

function resize() {
	header && html.style.setProperty("--height-header", header.offsetHeight + "px");
	html.style.setProperty("--vh", (window.innerHeight * 0.01).toFixed(2) + "px");
}

resize();
window.addEventListener("resize", resize);


const cue = new ScrollCue({
	anchorContainer: "section, .header, .footer",
	at: -600,
	delay: 100
}).init();
