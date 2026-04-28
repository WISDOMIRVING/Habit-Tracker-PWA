# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> Habit Tracker app >> loads the cached app shell when offline after the app has been loaded once
- Location: tests\e2e\app.spec.ts:131:7

# Error details

```
Error: page.reload: net::ERR_INTERNET_DISCONNECTED
Call log:
  - waiting for navigation until "load"

```

# Test source

```ts
  36  | 
  37  |   test('signs up a new user and lands on the dashboard', async ({ page }) => {
  38  |     await page.goto('/signup');
  39  |     await page.getByTestId('auth-signup-email').fill('new@example.com');
  40  |     await page.getByTestId('auth-signup-password').fill('password123');
  41  |     await page.getByTestId('auth-signup-submit').click();
  42  |     await expect(page).toHaveURL(/\/dashboard/);
  43  |     await expect(page.getByTestId('dashboard-page')).toBeVisible();
  44  |   });
  45  | 
  46  |   test('logs in an existing user and loads only that user\'s habits', async ({ page }) => {
  47  |     // Signup user 1 and create a habit
  48  |     await page.goto('/signup');
  49  |     await page.getByTestId('auth-signup-email').fill('user1@example.com');
  50  |     await page.getByTestId('auth-signup-password').fill('pass1');
  51  |     await page.getByTestId('auth-signup-submit').click();
  52  |     await expect(page).toHaveURL(/\/dashboard/);
  53  |     await page.getByTestId('create-habit-button').click();
  54  |     await page.getByTestId('habit-name-input').fill('User 1 Habit');
  55  |     await page.getByTestId('habit-save-button').click();
  56  |     await expect(page.getByTestId('habit-card-user-1-habit')).toBeVisible();
  57  |     await page.getByTestId('auth-logout-button').click();
  58  |     await expect(page).toHaveURL(/\/login/);
  59  | 
  60  |     // Signup user 2
  61  |     await page.goto('/signup');
  62  |     await page.getByTestId('auth-signup-email').fill('user2@example.com');
  63  |     await page.getByTestId('auth-signup-password').fill('pass2');
  64  |     await page.getByTestId('auth-signup-submit').click();
  65  |     await expect(page).toHaveURL(/\/dashboard/);
  66  |     await expect(page.getByTestId('empty-state')).toBeVisible();
  67  |     const habitCard = page.locator('[data-testid="habit-card-user-1-habit"]');
  68  |     await expect(habitCard).not.toBeVisible();
  69  |   });
  70  | 
  71  |   test('creates a habit from the dashboard', async ({ page }) => {
  72  |     await page.goto('/signup');
  73  |     await page.getByTestId('auth-signup-email').fill('test@example.com');
  74  |     await page.getByTestId('auth-signup-password').fill('pass');
  75  |     await page.getByTestId('auth-signup-submit').click();
  76  | 
  77  |     await page.getByTestId('create-habit-button').click();
  78  |     await page.getByTestId('habit-name-input').fill('Drink Water');
  79  |     await page.getByTestId('habit-description-input').fill('2 liters a day');
  80  |     await page.getByTestId('habit-save-button').click();
  81  | 
  82  |     await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
  83  |     await expect(page.getByText('2 liters a day')).toBeVisible();
  84  |   });
  85  | 
  86  |   test('completes a habit for today and updates the streak', async ({ page }) => {
  87  |     await page.goto('/signup');
  88  |     await page.getByTestId('auth-signup-email').fill('test@example.com');
  89  |     await page.getByTestId('auth-signup-password').fill('pass');
  90  |     await page.getByTestId('auth-signup-submit').click();
  91  | 
  92  |     await page.getByTestId('create-habit-button').click();
  93  |     await page.getByTestId('habit-name-input').fill('Streak Habit');
  94  |     await page.getByTestId('habit-save-button').click();
  95  | 
  96  |     const streakLocator = page.getByTestId('habit-streak-streak-habit');
  97  |     await expect(streakLocator).toContainText('0');
  98  |     await page.getByTestId('habit-complete-streak-habit').click();
  99  |     await expect(streakLocator).toContainText('1');
  100 |   });
  101 | 
  102 |   test('persists session and habits after page reload', async ({ page }) => {
  103 |     await page.goto('/signup');
  104 |     await page.getByTestId('auth-signup-email').fill('test@example.com');
  105 |     await page.getByTestId('auth-signup-password').fill('pass');
  106 |     await page.getByTestId('auth-signup-submit').click();
  107 | 
  108 |     await page.getByTestId('create-habit-button').click();
  109 |     await page.getByTestId('habit-name-input').fill('Persistent Habit');
  110 |     await page.getByTestId('habit-save-button').click();
  111 | 
  112 |     await page.reload();
  113 |     await expect(page.getByTestId('habit-card-persistent-habit')).toBeVisible();
  114 |     await expect(page.getByTestId('dashboard-page')).toBeVisible();
  115 |   });
  116 | 
  117 |   test('logs out and redirects to /login', async ({ page }) => {
  118 |     await page.goto('/signup');
  119 |     await page.getByTestId('auth-signup-email').fill('logout@example.com');
  120 |     await page.getByTestId('auth-signup-password').fill('pass');
  121 |     await page.getByTestId('auth-signup-submit').click();
  122 |     await expect(page).toHaveURL(/\/dashboard/);
  123 | 
  124 |     await page.getByTestId('auth-logout-button').click();
  125 |     await expect(page).toHaveURL(/\/login/);
  126 |     
  127 |     await page.goto('/dashboard');
  128 |     await expect(page).toHaveURL(/\/login/);
  129 |   });
  130 | 
  131 |   test('loads the cached app shell when offline after the app has been loaded once', async ({ page, context }) => {
  132 |     await page.goto('/login');
  133 |     await page.waitForTimeout(5000);
  134 | 
  135 |     await context.setOffline(true);
> 136 |     await page.reload();
      |                ^ Error: page.reload: net::ERR_INTERNET_DISCONNECTED
  137 |     
  138 |     await expect(page.getByTestId('auth-login-email')).toBeVisible();
  139 |   });
  140 | });
  141 | 
```