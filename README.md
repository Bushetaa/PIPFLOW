Market Flow (PIPFLOW)
======================

Overview
--------

Market Flow (branded in the UI as **PIPFLOW**) is a full‑stack TypeScript trading assistant.  
It combines a Node.js/Express backend, a Vite + React frontend, and PostgreSQL via Drizzle ORM to deliver:

- Real‑time market overview cards for major FX pairs
- Rich analytical reports with bilingual (EN/AR) content
- A clean dashboard with glass‑morphism styling and subtle 3D‑style background motion
- Language‑aware layout (LTR/RTL) with a global English/Arabic toggle

Tech Stack
----------

- Runtime: Node.js
- Backend: Express (TypeScript)
- Frontend: React + Vite (TypeScript)
- State / Data:
  - @tanstack/react-query for data fetching and caching
  - Zustand for language state and UI language translations
- Database: PostgreSQL with Drizzle ORM
- Styling:
  - Tailwind CSS with custom design tokens
  - Shadcn UI components
  - Framer Motion animations
- Routing (client): Wouter

Project Structure (High Level)
------------------------------

- `server/`
  - Express entry point, API routes, and static file serving
- `client/`
  - `index.html` – Vite entry HTML (no favicon reference)
  - `src/`
    - `App.tsx` – main layout (header + pages)
    - `pages/` – dashboard, market, reports, and 404 pages
    - `components/` – shared UI components (cards, modals, etc.)
    - `hooks/` – custom hooks such as language handling and data fetching
- `shared/`
  - Shared types and schemas between client and server

Environment Variables
---------------------

Create a `.env` file in the project root with at least:

- `DATABASE_URL` – PostgreSQL connection string (required)
- `PORT` – HTTP port for the Express server (defaults to `5000` if not set)

Scripts
-------

All commands are executed from the project root.

- `npm run dev`  
  Starts the development server (Express + Vite) with TypeScript via `tsx`.

- `npm run build`  
  Builds the server and client, outputting to `dist/`.

- `npm start`  
  Runs the compiled production server from `dist/index.cjs`.

- `npm run check`  
  Runs the TypeScript compiler in `noEmit` mode to typecheck the entire monorepo.

Frontend Language Behavior
--------------------------

The app supports **two languages**:

- English (`en`) – left‑to‑right layout
- Arabic (`ar`) – right‑to‑left layout

Key points:

- Language state is managed by a global Zustand store exposed via the `useLanguage` hook.
- Switching the language updates:
  - `document.documentElement.dir` (`ltr` or `rtl`)
  - `document.documentElement.lang` (`en` or `ar`)
- Translation keys are defined in a single `translations` map and accessed via `t("key")`.
- When English is selected, **only English** text appears in the interface.  
  When Arabic is selected, **only Arabic** text appears. No mixed‑language labels are shown.

Main UI Areas
-------------

- **Header**
  - Brand mark (“P”) and localized title from translations: `pipflow`.
  - Localized tagline from translations: `platform_tagline`.
  - Language switcher (EN/AR) and dark‑mode toggle.

- **Sidebar**
  - Navigation items: dashboard, market, reports, and settings.
  - Uses icons and translated labels via `t("dashboard")`, `t("market")`, etc.

- **Dashboard Page**
  - Market overview cards driven by API data.
  - Recent analysis section displaying reports with localized titles and summaries.
  - Timeframe labels and supporting text are fully translated.

- **Market Page**
  - Searchable list of market cards using the same sentiment and price visuals as the dashboard.
  - Uses translations for labels like `market`, `search`, `high`, `low`, and `no_data`.

- **Reports Page**
  - Grid of created reports with localized title/summary per active language.
  - Confidence, sentiment, and dates are formatted and displayed according to the active locale.

- **Report Modal**
  - Dialog for creating new analysis reports.
  - Fields for pair, timeframe, sentiment, confidence, and content in **both English and Arabic**.
  - Section headers, inputs, and buttons are fully localized.

- **404 Page**
  - Uses translation keys for the title and hint message so the not‑found view also respects language selection.

Background & Visual Design
--------------------------

- Uses Tailwind utility classes plus custom `glass-card` styles for a modern glass‑morphism look.
- Background uses a soft animated grid mask to simulate subtle 3D movement without heavy GPU load.
- Cards and elements use hover elevation and rotation for a professional, responsive feel.

Development Notes
-----------------

- Keep all user‑facing strings inside the translation map used by `useLanguage`.
- Avoid hardcoding English or Arabic text directly in components; always go through the translation helper (`t`).
- When adding new pages or components, ensure both languages are covered to maintain the clean separation of English‑only and Arabic‑only modes.

License
-------

This project is licensed under the MIT license (see `package.json`).

