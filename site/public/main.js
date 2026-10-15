const nextButton = document.querySelector("#demo-next");
if (nextButton) {
	let currentStep = 0;
	const captions = [
		"01 / Set the scene with a chapter card.",
		"02 / Replace the draft with readable typing.",
		"03 / Move the pointer. Add the task.",
		"04 / Assert the result. Ready for review.",
	];
	nextButton.hidden = false;
	nextButton.addEventListener("click", () => {
		currentStep = (currentStep + 1) % captions.length;
		document.querySelector("#demo-input").textContent =
			currentStep === 0 ? "Draft task" : currentStep === 1 ? "Ship a replayable demo" : "";
		document.querySelector("#demo-result").textContent =
			currentStep < 2 ? "○ Your next task starts here." : "✓ Ship a replayable demo";
		document.querySelector("#demo-caption").textContent = captions[currentStep];
		document.querySelector("#demo-status").textContent = captions[currentStep];
		document
			.querySelectorAll("[data-step]")
			.forEach((step, index) => step.classList.toggle("active", index === currentStep));
		nextButton.textContent = currentStep === 3 ? "Replay ↻" : "Next step →";
	});
}

for (const button of document.querySelectorAll("[data-copy]")) {
	button.hidden = false;
	button.addEventListener("click", async () => {
		const code = document.getElementById(button.dataset.copy);
		const status = document.getElementById(`${button.dataset.copy}-status`);
		try {
			await navigator.clipboard.writeText(code.textContent);
			status.textContent =
				button.dataset.copySuccess ?? "Copied. Paste these commands into your terminal.";
		} catch {
			status.textContent = "Clipboard unavailable. Select and copy the text manually.";
			code.closest("pre").focus();
		}
	});
}
