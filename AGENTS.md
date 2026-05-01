# Repository Guidelines

## Project Structure & Module Organization

This repository contains a small full-stack workflow application.

- `backend/` holds the Express API. `backend/server.js` starts the server, while `backend/src/app.js` wires middleware and routes.
- `backend/src/modules/` is organized by domain: `auth`, `profile`, `job`, and `match`. Keep new backend code in the matching module using the existing `*.routes.js`, `*.controller.js`, `*.model.js`, and `*.service.js` pattern.
- `frontend/` contains the React/Vite app. Pages live in `frontend/src/pages/`, shared client setup lives in `frontend/src/lib/`, and static files live in `frontend/public/`.
- `workflows/` stores n8n workflow exports as JSON. Preserve numeric prefixes such as `1_onboarding_inteligente.json` when adding ordered workflows.
- `docker-compose.yml` runs n8n and mounts `./workflows` into the container.

## Build, Test, and Development Commands

- `npm install` installs root/backend dependencies.
- `node backend/server.js` runs the Express API on `PORT` or `3001`.
- `npm --prefix frontend install` installs frontend dependencies.
- `npm --prefix frontend run dev` starts the Vite dev server.
- `npm --prefix frontend run build` creates the production frontend bundle in `frontend/dist/`.
- `npm --prefix frontend run lint` runs ESLint over frontend JavaScript and JSX.
- `docker compose up -d` starts n8n on `http://localhost:5678`.

The root `npm test` script is currently a placeholder that exits with an error.

## Coding Style & Naming Conventions

Backend code uses CommonJS (`require`, `module.exports`) and 4-space indentation in existing files. Frontend code uses ES modules, React components in PascalCase, and 2-space indentation. Match the surrounding file style when editing.

Use descriptive domain names for backend files, for example `profile.service.js` or `match.controller.js`. React page entry files currently use `index.jsx`; reusable components use PascalCase filenames such as `LoginForm.jsx`.

## Testing Guidelines

There is no configured automated test framework yet. Before changing API behavior, run the backend locally and verify relevant endpoints, including `GET /api/health`. For frontend changes, run `npm --prefix frontend run lint` and build before submitting.

Existing ad hoc backend checks include `backend/test-connections.js` and `backend/test_db2.js`; document any required environment variables before relying on them.

## Commit & Pull Request Guidelines

Recent commits use short, Spanish, imperative-style summaries, for example `analisis de cv con N8N implementado` and `ventana de postulaciones implementada`. Keep commits focused and describe the user-visible change.

Pull requests should include a short summary, test or manual verification notes, linked issues when applicable, and screenshots for frontend UI changes. Mention workflow JSON changes explicitly so reviewers can re-import or validate them in n8n.

## Security & Configuration Tips

Do not commit `.env` files or credentials. This project uses environment files at the repository root and under `backend/`; keep secrets local and document required variable names instead of values.
