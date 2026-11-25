// Entry point. Every section of the site lives in its own module in ./modules;
// this file only wires them up in the order the page needs them.

import { initHeader } from "./modules/header.js";
import { initHeaderDropdowns } from "./modules/header-dropdowns.js";
import { initBookingForm } from "./modules/booking-form.js";
import { initReviewsSlider } from "./modules/reviews-slider.js";
import { initAreas } from "./modules/areas.js";
import { initHeroTitleSlider } from "./modules/hero-title-slider.js";
import { initServicesSlider } from "./modules/services-slider.js";
import { initFaqAccordion } from "./modules/faq-accordion.js";
import { initFaqPage } from "./modules/faq-page.js";
import { initAnchorLinks } from "./modules/anchor-links.js";
import { initCasesFilter } from "./modules/cases-filter.js";
import { initLightbox } from "./modules/lightbox.js";
import { setImageAspectRatios } from "./modules/aspect-ratio.js";
import { initMarquee } from "./modules/marquee.js";
import { initViewTransition } from "./modules/view-transition.js";
import { initScrollCue } from "./modules/scroll-cue.js";

initHeader();
initHeaderDropdowns();
initBookingForm();
initReviewsSlider();
initAreas();
initHeroTitleSlider();
initServicesSlider();
initFaqAccordion();
initFaqPage();
initAnchorLinks();
initCasesFilter();
initLightbox();
setImageAspectRatios();
initMarquee();
initViewTransition();
initScrollCue();
