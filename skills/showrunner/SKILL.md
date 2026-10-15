---
name: showrunner
description: Create, verify, and record replayable Playwright demos of application changes with Showrunner. Use when asked to demo a change, make a browser walkthrough, or prepare a pull request recording; keep scenarios and application setup in the consumer repository.
---

# Showrunner

Turn the requested application change into a checked, replayable browser story. Own scenario authoring, local setup, execution, recording, and the handoff. A written scenario is not a verified demo, and a passing test is not proof that its recording is legible.

## Find the story and the application

Read the consumer repository's instructions and inspect its worktree, relevant diff, Playwright configuration, fixtures, and page objects. Use the user's specified change or comparison; otherwise start with the current diff. Identify the visible behavior and the assertion that demonstrates it. For a change without a browser-visible outcome, explain that limitation instead of inventing UI proof.

Keep routes, authentication, test accounts, data setup, cleanup, and scenarios in the consumer repo. Reuse existing test infrastructure and its development environment. Use local or designated test data. Do not put application knowledge into the Showrunner library or replace existing configuration wholesale.

## Prepare the runtime

Check the installed Showrunner version and its documentation before choosing APIs. Prefer `node_modules/@smeltery/showrunner/docs/` or the supplied checkout's `docs/`; the [upstream usage guide](https://github.com/smeltery/showrunner/blob/main/docs/usage.md) covers installation and fixture composition.

`@smeltery/showrunner` is private on GitHub Packages, not public npm. Reuse an authenticated registry configuration or a local build that the user can access. Never print tokens or commit registry credentials. Installing this skill does not install the library, browsers, or application dependencies.

Use the consumer's package manager and supported Playwright peer version. In the Showrunner checkout, develop inside `flox activate`. Start the application with its established command or reuse its Playwright `webServer`. Check readiness with an actual page or endpoint, not a presentation delay.

If needed, read [scenario and recording setup](references/scenario.md) for a minimal two-pass configuration. Adapt it to the consumer instead of requiring new infrastructure.

## Author the scenario

- Import `test` and `expect` from Showrunner, or compose its `test` with the application's fixtures using Playwright `mergeTests`.
- Use standard role, label, and test-id locators. `demo.click` and `demo.fill` still rely on Playwright actionability; do not replace a failing interaction with DOM mutation or a forced click to make a recording pass.
- Choose a short story with a visible starting state, meaningful action, and asserted outcome. Add captions or chapter cards only where they help explain the change.
- Keep presentation pacing separate from readiness. Use `expect` for the outcome. Set `demoOptions.pace` to `0` for verification and restore a readable pace for recording.
- Make repeated runs independent: seed disposable data or reset it through application fixtures. Verify cleanup when the flow mutates data.
- The fixture installs its overlay on the main page. After `page.setContent`, use `demo.ensure()`. For a separate page or popup, construct `new Demo(page)` and call `install()`.

Do not describe mocked responses as real backend behavior. If fixtures mock a service, make that limit explicit in the handoff.

## Verify, record, and inspect

Run the focused scenario without presentation delays first. Investigate assertion, locator, setup, or cleanup failures; fix the cause within scope and rerun. Do not remove assertions, inflate sleeps, or disguise an application bug to obtain a green result.

Then run the same story with pacing, `video: "on"`, and trace capture. Keep verification and recording outputs separate so a subsequent run does not erase the recording. Check the actual artifact paths after the browser context closes.

Inspect the recording with an available media viewer. If only screenshots or a trace can be inspected, review those and explicitly say video playback was not checked. Check the start, key action, and final state for readable text, cursor visibility, captions covering controls, and adequate hold time. Repair demonstrated issues and rerun the affected pass.

Keep generated recordings, traces, screenshots, and authentication state out of Git. Preserve the reusable scenario in the consumer worktree; commit, upload, or post to a PR only when authorized in the session. A demo request alone does not authorize sending a recording elsewhere.

If progress depends on unavailable credentials, an inaccessible app, or a repeated failure that yields no new evidence, stop with the concrete blocker, completed files, and exact resume command. Do not claim recording or verification succeeded.

## Hand off

Report the scenario path, the behavior and assertions checked, the exact verification and recording commands, their results, and the video/trace paths that actually exist. Distinguish real integrations from mocks and visual review from automated assertions. Include any remaining blocker and a concise summary suitable for the user's review workflow.
