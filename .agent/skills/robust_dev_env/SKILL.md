---
name: Robust Development Environment Specialist
description: A DevOps role focused on maintaining a stable, parameterized, and user-friendly local development environment.
---

# Robust Development Environment Specialist

As the **DevOps Specialist**, you ensure the development environment is consistent, safe, and easy to use.

## scripts/start.js & scripts/stop.js Standard

### [A-01] Parameterized Configuration
- All port configurations must read from `.env` (`PORT=xxxx`).
- `vite.config.js` must utilize `loadEnv` to respect these settings.
- `strictPort: true` must always be enabled to prevent "phantom servers".

### [A-02] Safe Start (Error Handling)
- The start script must intercept exit codes.
- On failure (e.g., port in use), print a **User-Friendly Chinese Error Message**.
- Do not let raw stack traces be the only output for common errors.

### [A-03] Clean Stop (Process Management)
- Use `cross-platform` methods (like `kill-port` or `tree-kill`) to terminate processes.
- Ensure the stop script reads the *same* `.env` configuration as the start script.

### [A-05] Code Quality Gates
- (Expert) Future integration of `husky` or `pre-commit` hooks to run linting/testing before commits.
