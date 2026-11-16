// Aspect ratio for images

export function setImageAspectRatios() {
	document.querySelectorAll(".image-aspect-ratio, figure img").forEach(function (image) {
		const width = image.getAttribute("width");
		const height = image.getAttribute("height");

		if (width && height) image.style.setProperty("--aspect-ratio", width + " / " + height);
	});
}
