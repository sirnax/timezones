# Contributing to WorldClock

Thanks for your interest in contributing! This is a small project, so the process is deliberately lightweight.

## Getting set up

1. Fork and clone the repo.
2. Use **Node.js 24+** (`nvm use` picks it up from [.nvmrc](.nvmrc)).
3. Install dependencies and start the dev server:

   ```bash
   npm install
   npm run dev
   ```

4. Open http://localhost:3000 and verify the map renders.

## Before opening a PR

- Run `npm run lint` and fix any issues.
- Run `npm run build` to make sure the production build succeeds — CI runs both on every PR.
- There is no test suite yet; if you add one, that would be a very welcome contribution.

## Guidelines

- **Open an issue first** for large changes (new features, refactors) so we can discuss the approach before you invest time.
- Keep PRs focused — one feature or fix per PR.
- Follow the existing commit style: a short prefix like `feat:`, `fix:`, `chore:`, or `refactor:` followed by a concise description.
- Match the surrounding code style; the project uses TypeScript strict mode, ESLint, and Prettier conventions.

## Reporting bugs

Please use the bug report issue template and include reproduction steps, expected vs. actual behavior, and your browser/OS.
