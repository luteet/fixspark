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

export function initMarquee() {
	buildMarquee();
	window.addEventListener("load", buildMarquee);

	window.addEventListener("resize", function () {
		clearTimeout(marqueeTimer);
		marqueeTimer = setTimeout(buildMarquee, 150);
	});
}
