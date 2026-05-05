# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack e-commerce webshop used as an educational project (assignments in `documents/Aufgaben/`, solutions tracked in git). Backend is an Express.js REST API; frontend is an Angular 21 SPA.

## Commands

All commands are run from within their respective subdirectory.

### Server (`sn-webshop-server/`)

```bash
npm install
npm run server:start      # Starts Express on port 3000
```

### Client (`sn-webshop-client/`)

```bash
npm install
npm run client:start                      # Dev server on port 4200
npm run client:build                      # Production build
npm run client:lint                       # ESLint + Prettier
npm run client:test                       # Vitest (headless)
npm run client:test:browser               # Vitest in Chromium
npm run client:test:browser:headless      # Vitest in headless Chromium
```

## Architecture

### Backend (`sn-webshop-server/`)

Express 5 + Sequelize + SQLite (in-memory). The database is **dropped and reseeded on every server start** using `initial-data/`. JWT authentication with a 1-minute access token and 2-minute refresh token (config in `config/auth.config.js`). CORS is configured for `localhost:4200` only.

```
app.js              # Express setup, middleware, route registration, DB init
config/             # auth.config.js – JWT secret & expiry
controllers/        # Business logic per resource
models/             # Sequelize models: User, Role, Product, ProductGroup, RefreshToken, …
routes/             # Route definitions (auth, user, product, product-group, checkout)
middleware/         # JWT verification, signup validation
initial-data/       # Seed data loaded at startup
```

### Frontend (`sn-webshop-client/`)

Angular 21 with **standalone components** (no NgModules), Angular Material, Transloco for i18n, and Vitest for testing.

```
src/app/
  core/             # App shell: routing (app.routes.ts), layout, login, registration, admin, 404
  feature/          # Lazy-loaded feature routes: dashboard, product, products, checkout, settings
  shared/           # Guards, interceptors, reusable components, services, validators, models
  transloco/        # i18n loader and configuration
```

**Path aliases** (defined in `tsconfig.json`, usable in imports):

| Alias | Resolves to |
|---|---|
| `@core/*` | `src/app/core/*` |
| `@shared/*` | `src/app/shared/*` |
| `@checkout/*` | `src/app/feature/checkout/*` |
| `@dashboard/*` | `src/app/feature/dashboard/*` |
| `@product/*` | `src/app/feature/product/*` |
| `@products/*` | `src/app/feature/products/*` |
| `@settings/*` | `src/app/feature/settings/*` |
| `@transloco/*` | `src/app/transloco/*` |

**Key patterns:**
- Authentication uses JWT interceptor (`shared/interceptor/auth.interceptor`) that attaches the access token and handles 401 refresh via the `RefreshToken` endpoint.
- Route protection via `shared/guard/`: `authGuard`, `adminGuard`, `userGuard`.
- Forms use **Angular Signals** (`SignalForms` API introduced in Angular 19+), not the classic `ReactiveFormsModule`.
- TypeScript strict mode is enabled including `strictTemplates` and `strictInjectionParameters`.
- Build size budgets: 500 kB initial warning, 1 MB error.
