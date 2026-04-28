# Habit Tracker PWA

A mobile-first Progressive Web App for tracking daily habits. Built as a technical execution task following a strict specification.

## Project Overview
This application allows users to create, manage, and track habits with local persistence. It features a streak counting mechanism, secure-feeling (local) authentication, and works offline as a PWA.

## Setup Instructions
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Install Playwright browsers if not already installed:
   ```bash
   npx playwright install chromium
   ```

## Run Instructions
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Test Instructions
Run all tests (unit, integration, and e2e):
```bash
npm run test
```

Or run them individually:
- **Unit Tests**: `npm run test:unit` (includes coverage)
- **Integration Tests**: `npm run test:integration`
- **E2E Tests**: `npm run test:e2e`

## Local Persistence Structure
The app uses `localStorage` for persistence with the following keys:
- `habit-tracker-users`: Stores an array of user objects (id, email, password, createdAt).
- `habit-tracker-session`: Stores the current active session (userId, email) or null.
- `habit-tracker-habits`: Stores an array of habit objects (id, userId, name, description, frequency, createdAt, completions).

## PWA Implementation
- **Manifest**: Located at `public/manifest.json`, defines the app name, icons, and display mode.
- **Service Worker**: Located at `public/sw.js`, implements caching strategies for the app shell and assets to enable offline functionality.
- **Registration**: Managed by the `ServiceWorkerRegistration` component in `src/components/ServiceWorkerRegistration.tsx`, which registers the worker on client-side load.

## Trade-offs and Limitations
- **Local Authentication**: Security is simulated as data is stored in plaintext in `localStorage`. This is for demonstration and local-only use.
- **Persistence**: Clearing browser cache/storage will result in loss of data.
- **Single Frequency**: Only 'daily' frequency is supported in this version as per requirements.

## Test Mapping
| Test File | Behavior Verified |
|-----------|-------------------|
| `tests/unit/slug.test.ts` | Habit name to slug conversion logic (lowercase, trimming, alphanumeric filtering). |
| `tests/unit/validators.test.ts` | Habit name validation (required, max length, trimming). |
| `tests/unit/streaks.test.ts` | Streak calculation logic (consecutive days, today's completion, duplicate handling). |
| `tests/unit/habits.test.ts` | Habit completion toggling logic (addition/removal, immutability, duplicate prevention). |
| `tests/integration/auth-flow.test.tsx` | Signup/Login UI flows, session creation, and error handling for duplicate users or invalid credentials. |
| `tests/integration/habit-form.test.tsx` | Habit CRUD operations, validation display, and streak updates within the dashboard UI. |
| `tests/e2e/app.spec.ts` | Full user journeys: Splash screen redirects, protected routes, cross-user data isolation, persistence after reload, and offline shell loading. |
