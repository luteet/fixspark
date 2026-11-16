import { reduceMotion } from "./utils.js";

// Services list — Swiper fade preview synced with the hovered/focused row

export function initServicesSlider() {
	const servicesList = document.querySelector(".services__list");
	const servicesSlider = document.querySelector(".services__frame");
	const servicesLinks = servicesList ? servicesList.querySelectorAll(".services__link") : [];

	let servicesSwiper = null;

	if (window.Swiper && servicesSlider) {
		servicesSwiper = new window.Swiper(servicesSlider, {
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

	if (!servicesLinks.length) return;

	servicesLinks.forEach(function (link, index) {
		link.addEventListener("mouseenter", function () {
			showServiceSlide(index);
		});

		link.addEventListener("focus", function () {
			showServiceSlide(index);
		});
	});
}
