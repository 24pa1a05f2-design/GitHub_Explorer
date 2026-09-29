import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const frontendDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const backendDirectory = resolve(frontendDirectory, "..", "backend");
const services = [
  {
    name: "Backend",
    child: spawn(process.execPath, ["--use-system-ca", "server.js"], {
      cwd: backendDirectory,
      stdio: "inherit"
    })
  },
  {
    name: "Frontend",
    child: spawn(
      process.execPath,
      [resolve(frontendDirectory, "node_modules", "vite", "bin", "vite.js"), ...process.argv.slice(2)],
      { cwd: frontendDirectory, stdio: "inherit" }
    )
  }
];

let stopping = false;

function stop(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  process.exitCode = exitCode;
  services.forEach(({ child }) => child.kill());
}

services.forEach(({ name, child }) => {
  child.on("error", (error) => {
    console.error(`${name} failed to start: ${error.message}`);
    stop(1);
  });

  child.on("exit", (code, signal) => {
    if (stopping) return;
    if (signal) {
      console.error(`${name} stopped after ${signal}.`);
    } else if (code !== 0) {
      console.error(`${name} exited with code ${code}.`);
    }
    stop(code ?? 1);
  });
});

process.once("SIGINT", () => stop());
process.once("SIGTERM", () => stop());
