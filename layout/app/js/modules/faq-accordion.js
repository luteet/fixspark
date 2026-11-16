// FAQ accordion (buttons instead of details/summary so the answer can animate).
// Only one answer stays open: opening an item closes the rest.
// While answers change height the clicked question is pinned to its viewport position,
// so collapsing another card never scrolls the page under the cursor.

const FAQ_PIN_DURATION = 240; // --motion-base (200ms) plus one frame

const faqQuestions = document.querySelectorAll(".faq__question");

export function closeFaqItem(faqItem) {
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

export function initFaqAccordion() {
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
}
