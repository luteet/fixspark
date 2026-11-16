import { reduceMotion } from "./utils.js";

// Reviews slider (Swiper from libs.min.js)

export function initReviewsSlider() {
	const reviewsSwiper = document.querySelector(".reviews__swiper");

	if (!window.Swiper || !reviewsSwiper) return;

	new window.Swiper(".reviews__swiper", {
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
