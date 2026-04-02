import { test, expect } from '@playwright/test';

test.describe('App smoke test', () => {
  test('redirects to /dashboard and shows the correct title and heading', async ({ page }) => {
    await page.goto('/');

    // Root route redirects to /dashboard
    await expect(page).toHaveURL(/\/dashboard/);

    // Page title follows the template set in main.ts
    await expect(page).toHaveTitle('Dashboard | Assets Tracker');

    // The DashboardShell renders an h1 with the page title
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });
});
