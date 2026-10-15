import { execFileSync } from "node:child_process";

execFileSync("pnpm", ["--dir", "site", "build"], { stdio: "inherit" });
