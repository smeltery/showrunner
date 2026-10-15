# Agent skill

The `showrunner` skill turns “demo this change” into a consumer-repository workflow: inspect the change, reuse app setup, author a scenario, verify it without presentation delays, record it with pacing, and report the artifacts and limitations.

The maintained skill lives in [skills/showrunner](../skills/showrunner/SKILL.md), alongside the library. It includes a portable scenario reference and optional agent UI metadata. Installing the skill does not install the runtime package or grant access to GitHub Packages.

## Install the skill

From the application repository, install the skill using the [skills CLI](https://github.com/vercel-labs/skills):

```sh
npx skills add smeltery/showrunner --skill showrunner
```

Select your agent in the installer. Alternatively, copy the entire `skills/showrunner/` directory into your agent's supported skills directory. Keep its `references/` directory with `SKILL.md`.

For local development, replace `smeltery/showrunner` with the absolute path to your checkout. The public skill and runtime package access are separate.

## Ask for a demo

```text
Use the showrunner skill to demo this change. Reuse this app's test setup,
verify the outcome, record the walkthrough, and tell me what passed
and where the recording is saved.
```

Specify a feature, diff, or route if the current change is ambiguous. The agent owns setup and execution within the available environment. Missing application access or credentials remain explicit blockers.

## What you get

- A reusable scenario in the application repository.
- Assertions tied to the requested behavior and a verification result.
- A paced recording and trace when the recording run succeeds.
- Actual artifact paths, replay commands, and limitations such as mocked services or unreviewed video playback.

The skill preserves app authentication, fixtures, page objects, and cleanup in the consumer repo. It does not post recordings to a pull request or commit changes without existing authorization. Generated media and credentials stay out of Git.

See [Usage](usage.md) for runtime installation and [Presentation API](presentation.md) for the library calls.
