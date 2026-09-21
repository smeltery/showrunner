import { test, expect } from "../src/index.js";

test("should add a task to the release checklist", async ({ page, demo }) => {
	await page.setContent(`
    <main style="font:24px system-ui;max-width:720px;margin:100px auto">
      <h1>Release checklist</h1>
      <form><label>Task <input name="task" value="Draft task"></label><button>Add task</button></form>
      <ul></ul>
    </main>
    <script>
      document.querySelector('form').addEventListener('submit', (event) => {
        event.preventDefault();
        const input = document.querySelector('input');
        const item = document.createElement('li');
        item.textContent = input.value;
        document.querySelector('ul').append(item);
        input.value = '';
      });
    </script>
  `);
	await demo.interstitial(
		"Every change deserves a good first take",
		"Showrunner · replayable PR demos",
	);
	await demo.caption("Replace the draft and add a release task");
	await demo.fill(page.getByRole("textbox", { name: "Task" }), "Ship a replayable demo");
	await demo.click(page.getByRole("button", { name: "Add task" }));
	await expect(page.getByRole("listitem")).toHaveText(["Ship a replayable demo"]);
	await demo.caption("One task added. Ready for review.");
	await demo.beat(1400);
});
