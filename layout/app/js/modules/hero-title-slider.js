import { reduceMotion } from "./utils.js";

// Hero title word slider (vertical, Swiper from libs.min.js)

export function initHeroTitleSlider() {
	const heroWordSlider = document.querySelector(".hero__title-slider");

	if (!window.Swiper || !heroWordSlider) return;

	new window.Swiper(heroWordSlider, {
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
