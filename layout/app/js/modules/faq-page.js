import { closeFaqItem } from "./faq-accordion.js";
import { reduceMotion, lockScrollPosition } from "./utils.js";

// FAQ page — topic filter, search and pagination. The markup carries the full
// list, so without JS every question stays readable; the script only narrows
// what is visible. Pagination is built here because the page count depends on
// the active topic and the search query.

const FAQ_PER_PAGE = 8;

export function initFaqPage() {
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
}
