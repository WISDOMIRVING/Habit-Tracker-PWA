# Habit Tracker PWA

A mobile-first Progressive Web App for tracking daily habits. Built as a strict technical execution task following a comprehensive specification.

## Project Overview
This application allows users to create, manage, and track habits with local persistence. It features a streak counting mechanism, secure-feeling (local) authentication, and works offline as a PWA.

---

## 🚀 How to Run the App

1. **Clone the repository.**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
4. Open **[http://localhost:3333](http://localhost:3333)** in your browser. *(Note: The app is configured to run on port 3333 to avoid conflicts and service worker caching issues).*

---

## 🧪 How to Run the Tests

The project includes a comprehensive test suite (Unit, Integration, and E2E) that strictly adheres to the technical requirements.

**Run all tests at once:**
```bash
npm run test
```

**Run test suites individually:**
- **Unit Tests:** `npm run test:unit` (runs Vitest with coverage report)
- **Integration Tests:** `npm run test:integration` (runs Vitest for React components)
- **End-to-End Tests:** `npm run test:e2e` (runs Playwright full-flow tests)

*(Note: If running E2E tests for the first time, you may need to install Playwright browsers via `npx playwright install chromium`)*

---

## 🗺️ How the Implementation Maps to Technical Requirements

The implementation rigorously follows the provided Technical Requirements Document:

1. **Strict Folder Structure:** The app strictly utilizes `src/app`, `src/components`, `src/lib`, `src/types`, and `tests/`.
2. **Data Contracts:** `src/types/auth.ts` and `src/types/habit.ts` define the exact TS interfaces requested (User, Session, Habit).
3. **Local Persistence Strategy:** State is completely client-side. The `src/lib/storage.ts` utility strictly manages the three required `localStorage` keys: `habit-tracker-users`, `habit-tracker-session`, and `habit-tracker-habits`.
4. **Offline PWA:** A `public/manifest.json` and custom `public/sw.js` are implemented to cache the app shell, allowing it to load when offline.
5. **Business Logic Extraction:** All core logic (slug generation, streak calculation, validation, habit toggling) was decoupled from components into pure functions inside `src/lib/`.
6. **Mentor Audit Marker:** The exact marker `/* MENTOR_TRACE_STAGE3_HABIT_A91 */` is placed on the first non-import line of `tests/unit/streaks.test.ts`.

---

## 🔍 Required Test Files and Verification Mapping

The testing strategy perfectly maps to the technical specification requirements. Every test file, describe block, and test title exactly matches the required standard.

### Unit Tests (Logic Verification)
- **`tests/unit/slug.test.ts`**
  - *Verifies:* Habit name to slug conversion logic (lowercase, trimming, alphanumeric filtering except hyphens).
- **`tests/unit/validators.test.ts`**
  - *Verifies:* Habit name validation rules (required, max length 60 chars, trimming).
- **`tests/unit/streaks.test.ts`**
  - *Verifies:* Streak calculation logic (consecutive days counting backward from today, duplicate handling, breaking streaks).
- **`tests/unit/habits.test.ts`**
  - *Verifies:* Habit completion toggling logic (addition/removal of dates, immutability of the original object, duplicate prevention).

### Integration Tests (Component & Flow Verification)
- **`tests/integration/auth-flow.test.tsx`**
  - *Verifies:* Signup/Login UI flows, session creation, and error handling for duplicate users or invalid credentials via React Testing Library.
- **`tests/integration/habit-form.test.tsx`**
  - *Verifies:* Habit CRUD operations, validation display, immutable field preservation, confirmation modals, and streak UI updates.

### End-to-End Tests (Full Journey Verification)
- **`tests/e2e/app.spec.ts`**
  - *Verifies:* Real browser interactions using Playwright. Covers the splash screen redirect, protected routing (`/dashboard`), cross-user data isolation, persistence after page reloads, and the critical offline app shell loading capability.

---

## ⚠️ Assumptions and Trade-offs

- **Local Authentication:** Security is entirely simulated. Passwords are saved in plaintext within `localStorage`. This is intentional based on the "secure-feeling but local" requirement, meant for demonstration purposes only.
- **Data Volatility:** Because `localStorage` is used, clearing the browser cache/storage or browsing in strict incognito mode will result in the loss of all user data.
- **Single Frequency:** Only the 'daily' habit frequency is supported in this implementation, as per the strict technical instructions.
- **Sequential E2E Testing:** Playwright workers are limited to `1` in the configuration. This prevents race conditions where parallel tests might aggressively overwrite the shared `localStorage` state on the local dev server.
