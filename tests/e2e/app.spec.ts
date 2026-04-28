import { test, expect } from '@playwright/test';

test.describe('Habit Tracker app', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('splash-screen')).toBeVisible();
    // Wait for the redirect timer (1200ms)
    await page.waitForTimeout(1500);
    await expect(page).toHaveURL(/\/login/);
  });

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    // First signup
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill('test@example.com');
    await page.getByTestId('auth-signup-password').fill('password123');
    await page.getByTestId('auth-signup-submit').click();
    await expect(page).toHaveURL(/\/dashboard/);

    // Then go to boot route
    await page.goto('/');
    await page.waitForTimeout(1500);
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill('new@example.com');
    await page.getByTestId('auth-signup-password').fill('password123');
    await page.getByTestId('auth-signup-submit').click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test('logs in an existing user and loads only that user\'s habits', async ({ page }) => {
    // Signup user 1 and create a habit
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill('user1@example.com');
    await page.getByTestId('auth-signup-password').fill('pass1');
    await page.getByTestId('auth-signup-submit').click();
    await expect(page).toHaveURL(/\/dashboard/);
    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('User 1 Habit');
    await page.getByTestId('habit-save-button').click();
    await expect(page.getByTestId('habit-card-user-1-habit')).toBeVisible();
    await page.getByTestId('auth-logout-button').click();
    await expect(page).toHaveURL(/\/login/);

    // Signup user 2
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill('user2@example.com');
    await page.getByTestId('auth-signup-password').fill('pass2');
    await page.getByTestId('auth-signup-submit').click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByTestId('empty-state')).toBeVisible();
    const habitCard = page.locator('[data-testid="habit-card-user-1-habit"]');
    await expect(habitCard).not.toBeVisible();
  });

  test('creates a habit from the dashboard', async ({ page }) => {
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill('test@example.com');
    await page.getByTestId('auth-signup-password').fill('pass');
    await page.getByTestId('auth-signup-submit').click();

    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Drink Water');
    await page.getByTestId('habit-description-input').fill('2 liters a day');
    await page.getByTestId('habit-save-button').click();

    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
    await expect(page.getByText('2 liters a day')).toBeVisible();
  });

  test('completes a habit for today and updates the streak', async ({ page }) => {
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill('test@example.com');
    await page.getByTestId('auth-signup-password').fill('pass');
    await page.getByTestId('auth-signup-submit').click();

    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Streak Habit');
    await page.getByTestId('habit-save-button').click();

    const streakLocator = page.getByTestId('habit-streak-streak-habit');
    await expect(streakLocator).toContainText('0');
    await page.getByTestId('habit-complete-streak-habit').click();
    await expect(streakLocator).toContainText('1');
  });

  test('persists session and habits after page reload', async ({ page }) => {
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill('test@example.com');
    await page.getByTestId('auth-signup-password').fill('pass');
    await page.getByTestId('auth-signup-submit').click();

    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Persistent Habit');
    await page.getByTestId('habit-save-button').click();

    await page.reload();
    await expect(page.getByTestId('habit-card-persistent-habit')).toBeVisible();
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test('logs out and redirects to /login', async ({ page }) => {
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill('logout@example.com');
    await page.getByTestId('auth-signup-password').fill('pass');
    await page.getByTestId('auth-signup-submit').click();
    await expect(page).toHaveURL(/\/dashboard/);

    await page.getByTestId('auth-logout-button').click();
    await expect(page).toHaveURL(/\/login/);
    
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('loads the cached app shell when offline after the app has been loaded once', async ({ page, context }) => {
    await page.goto('/login');
    await page.waitForTimeout(5000);

    await context.setOffline(true);
    await page.reload();
    
    await expect(page.getByTestId('auth-login-email')).toBeVisible();
  });
});
