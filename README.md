# GenZ Bank

**Banking at Your Speed** — a simulated digital banking experience built with React, TypeScript, and Vite, backed by a TypeScript serverless API on the AppDeploy platform.

> **Demo application.** GenZ Bank is not a licensed financial institution. No real money, real bank accounts, or real payment networks are involved.

---

## Project structure

```
genz-bank/
├── frontend/                       React + Vite application
│   ├── src/
│   │   ├── App.tsx                 Root component — auth, routing, modals
│   │   ├── main.tsx                React entry point
│   │   ├── index.css               Full design system (CSS custom properties)
│   │   ├── types.ts                Shared domain types
│   │   ├── lib/
│   │   │   ├── api.ts              AppDeploy auth + API wrappers
│   │   │   ├── csv.ts              CSV statement export
│   │   │   └── format.ts           Money, date, and error formatters
│   │   ├── components/
│   │   │   ├── layout/             Sidebar, Topbar
│   │   │   ├── goals/              GoalRow
│   │   │   ├── modals/             ActionModal (deposit/withdrawal/goal/contribute)
│   │   │   ├── transactions/       TransactionList
│   │   │   └── ui/                 BrandMark, ErrorBoundary, PageTitle, Toast, Toggle
│   │   └── pages/                  One file per page (8 pages)
│   ├── index.html
│   ├── package.json                Frontend-only dependencies and scripts
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── backend/                        AppDeploy serverless API handlers
│   ├── index.ts                    API route handlers (platform entry point)
│   ├── realtime.ts                 WebSocket connection lifecycle
│   ├── realtime-subscribers.ts     Real-time subscription management
│   ├── src/                        Canonical copies of the backend source
│   │   ├── index.ts
│   │   ├── realtime.ts
│   │   └── realtime-subscribers.ts
│   ├── node_modules/
│   │   └── @appdeploy/sdk/         Local type stub (committed, not generated)
│   │       ├── index.d.ts          Type declarations for local tsc checks
│   │       ├── index.js            Runtime stub (throws — platform only)
│   │       └── package.json
│   ├── types/
│   │   └── appdeploy__sdk.d.ts     Authoritative type stub source
│   ├── package.json                Backend-only dependencies and scripts
│   └── tsconfig.json
│
├── tests/
│   └── tests.json                  Declarative E2E test specifications
│
├── .env.example                    Environment variable reference (both apps)
├── .gitignore
├── appdeploy.auth-login.json       AppDeploy sign-in UI configuration
├── package.json                    Workspace root — combined scripts
└── README.md
```

---

## Technologies

| Layer | Technology |
|---|---|
| Frontend framework | React 19 with TypeScript |
| Build tool | Vite 6 |
| Styling | Custom CSS design system (CSS custom properties) |
| Icons | lucide-react |
| Backend runtime | AppDeploy platform (serverless functions) |
| Auth provider | AppDeploy auth (Google, Apple, X, email) |
| Database | AppDeploy managed key-value store |
| Package management | npm workspaces (frontend + backend) |

---

## How the frontend communicates with the backend

The frontend (`frontend/src/lib/api.ts`) imports `auth` and `api` from `@appdeploy/client`, which the AppDeploy platform injects at runtime as a script module. There is no local HTTP proxy or dev server bridge — the frontend talks to the backend exclusively through the platform's hosted API gateway.

The API contract:

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Liveness check |
| `GET` | `/api/me` | Load authenticated user's account data |
| `POST` | `/api/money-movement` | Record a demo deposit or withdrawal |
| `POST` | `/api/goals` | Create a new savings goal |
| `POST` | `/api/goals/:id/contribute` | Add a contribution to a goal |
| `PUT` | `/api/card` | Update virtual card settings |
| `PUT` | `/api/notifications/read-all` | Mark all notifications as read |

---

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm 8 or later (workspaces support)
- An [AppDeploy](https://appdeploy.io) project (required for auth and API at runtime)

---

## Installation

Run once from the project root. npm workspaces installs both `frontend/` and `backend/` dependencies and hoists shared packages to the root `node_modules/`.

```bash
npm install
```

---

## Environment setup

```bash
cp .env.example .env
```

Review `.env.example` — the comments explain which variables apply to the frontend versus the backend. No variables are required for the local build; AppDeploy injects its runtime configuration automatically on deployment.

---

## Starting the frontend (local dev)

> **Note:** `@appdeploy/client` is only available inside the AppDeploy runtime. Running the Vite dev server locally will serve the UI, but auth and API calls will fail with a descriptive error until the project is deployed on AppDeploy.

```bash
# From the project root:
npm run dev

# Or directly from frontend/:
cd frontend
npm run dev
```

Vite starts at [http://localhost:5173](http://localhost:5173).

---

## Starting the backend (local dev)

The backend runs as AppDeploy serverless functions. There is no standalone local server. To test backend routes locally, deploy to AppDeploy and use the platform's preview environment.

To type-check the backend locally without deploying:

```bash
npm run typecheck:backend
```

---

## Starting both services

Because the backend has no local dev server, there is no "start both" command. Start the frontend with `npm run dev` and interact with the deployed backend through AppDeploy's hosted environment.

---

## Building the frontend

```bash
# From the project root:
npm run build

# Output is written to frontend/dist/
```

The build script runs `tsc --noEmit` before Vite, so any type errors block the build.

---

## Type checking

```bash
# Check both workspaces:
npm run typecheck

# Frontend only:
npm run typecheck:frontend

# Backend only:
npm run typecheck:backend
```

---

## Testing

`tests/tests.json` contains declarative end-to-end test specifications. These are manual test scripts — there is no automated test runner configured. Each entry describes the preconditions, steps, and expected outcome for a key workflow.

To run them, follow each specification's steps manually against a deployed AppDeploy environment.

---

## Deployment

Deploy through the [AppDeploy platform](https://appdeploy.io):

1. Connect your repository to an AppDeploy project.
2. The platform runs `npm run build` (workspace-aware) and deploys `frontend/dist/` as static assets.
3. The platform deploys `backend/index.ts`, `backend/realtime.ts`, and `backend/realtime-subscribers.ts` as serverless functions.
4. `appdeploy.auth-login.json` (at the project root) configures the sign-in UI.
5. `@appdeploy/client` and `@appdeploy/sdk` are injected automatically at runtime.

---

## Database initialization

No manual setup required. When a user signs in for the first time, `backend/index.ts → loadOrCreate()` provisions a new demo account with:

- Starting balance: **NPR 25,000** (stored as 2,500,000 paisa)
- One welcome deposit transaction
- One sample savings goal (Emergency fund)
- One welcome notification

Each user's data is stored in an isolated table named `genz-bank-{userId}`.

---

## Known limitations

| Limitation | Detail |
|---|---|
| Platform dependency | Auth, API, and database require the AppDeploy platform. Local dev is UI-only. |
| No local API server | The backend cannot run standalone — it is AppDeploy serverless-only. |
| No automated tests | `tests/tests.json` is a manual checklist, not a runnable test suite. |
| Real-time not active | The WebSocket infrastructure in `backend/realtime*.ts` is implemented but not wired to live events. |
| Single account per user | Each user has exactly one demo account. |
| Transaction and goal limits | Max 100 transactions and 30 goals stored per account. |

---

## Backend type stub for @appdeploy/sdk

`@appdeploy/sdk` is injected by the AppDeploy platform at deploy time and is not available as an npm package. To allow `tsc --noEmit` to type-check the backend locally, the project includes a hand-authored stub at:

```
backend/node_modules/@appdeploy/sdk/index.d.ts
backend/types/appdeploy__sdk.d.ts   ← authoritative source, edit this one
```

This directory is **committed to source control** — it is authored code, not a generated artifact. If you need to update the type declarations (e.g. after an AppDeploy SDK update), edit `backend/types/appdeploy__sdk.d.ts` and copy the result to `backend/node_modules/@appdeploy/sdk/index.d.ts`.

---

## Security notes

- No secrets are stored in source code or committed files.
- Authentication tokens are managed entirely by the AppDeploy platform.
- Every protected backend route uses `requireAuth()` middleware.
- User data is isolated by `userId` — a user can only access their own record.
- All balance mutations are validated server-side; the frontend never supplies the authoritative balance.
- All monetary amounts are stored in integer paisa (1/100 NPR) to avoid floating-point arithmetic errors.
