// Booking form: custom select (SlimSelect from libs.min.js), service
// preselection and the demo submit handler.
//
// The native <select> stays in the form as the value holder; the library
// renders its control right next to it.

const serviceSelect = document.getElementById("service");

export function setServiceError(isError) {
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

// Puts a service into the booking form. Used by the header dropdown links and
// by the service page's own data-preselect-service attribute.

export function selectService(name) {
	if (!serviceSelect || !name) return;

	if (serviceSelectControl) {
		serviceSelectControl.setSelected(name);
	} else {
		serviceSelect.value = name;
	}
}

const form = document.getElementById("booking-form");
const statusElement = document.getElementById("form-status");

export function initBookingForm() {
	// Service page: preselect the page's own service in the booking form.
	// The page opts in with data-preselect-service="<option label>" on <main>.

	const preselectRoot = document.querySelector("[data-preselect-service]");

	if (preselectRoot) selectService(preselectRoot.getAttribute("data-preselect-service"));

	// Booking form (preview only)

	if (!form || !statusElement) return;

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
