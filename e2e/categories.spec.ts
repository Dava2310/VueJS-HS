import { test, expect } from '@playwright/test';

const CATEGORY_CREATED_MESSAGE = /Category created successfully/i;

const TEST_TIMEOUT_MS = 3 * 60 * 1_000;
const TOAST_TIMEOUT_MS = 2.5 * 60 * 1_000;

function categoryCodeFromDate(date: Date): string {
  return `cat-${String(date.getTime()).slice(-6)}`;
}

function buildCreateCategoryPayload() {
  const now = new Date();
  return {
    name: 'E2E Category',
    code: categoryCodeFromDate(now),
    description: 'Created by Playwright e2e test',
  };
}

test.describe('Categories page', () => {
  test('opens the create modal, submits the form, and shows a success toast', async ({ page }) => {
    test.setTimeout(TEST_TIMEOUT_MS);

    const data = buildCreateCategoryPayload();

    // ── 1. Navigate ──────────────────────────────────────────────────────────
    await test.step('Navigate to categories', async () => {
      await page.goto('/categories');
      await expect(page.getByRole('heading', { name: 'Categories' })).toBeVisible({
        timeout: 30_000,
      });
    });

    // ── 2. Open dialog ───────────────────────────────────────────────────────
    await test.step('Open "Create category" dialog', async () => {
      await page.getByRole('button', { name: /create category/i }).click();
      await expect(page.getByRole('dialog', { name: /create category/i })).toBeVisible();
    });

    const dialog = page.getByRole('dialog', { name: /create category/i });

    // ── 3. Fill form ─────────────────────────────────────────────────────────
    await test.step('Fill category form', async () => {
      await dialog.getByLabel("Category's Name").fill(data.name);
      await dialog.getByLabel('Category Code').fill(data.code);
      await dialog.getByLabel('Description').fill(data.description);
    });

    const successToast = page
      .locator('[data-sonner-toast][data-type="success"]')
      .filter({ hasText: CATEGORY_CREATED_MESSAGE });
    const errorToast = page.locator('[data-sonner-toast][data-type="error"]');

    const toastResultPromise = Promise.race([
      successToast
        .waitFor({ state: 'visible', timeout: TOAST_TIMEOUT_MS })
        .then(() => 'success' as const),
      errorToast
        .waitFor({ state: 'visible', timeout: TOAST_TIMEOUT_MS })
        .then(() => 'error' as const),
    ]).catch(() => 'timeout' as const);

    // ── 4. Submit ────────────────────────────────────────────────────────────
    await test.step('Submit form', async () => {
      await dialog.getByRole('button', { name: 'Submit' }).click();
    });

    // ── 5. Assert success toast ──────────────────────────────────────────────
    await test.step('Assert success toast', async () => {
      const result = await toastResultPromise;

      if (result === 'error') {
        const errorText = await errorToast.textContent().catch(() => '(could not read text)');
        throw new Error(`API returned an error toast: "${errorText?.trim()}"`);
      }
      if (result === 'timeout') {
        throw new Error('Neither a success nor an error toast appeared within the timeout window.');
      }
    });

    // ── 6. Dialog closes ─────────────────────────────────────────────────────
    await test.step('Dialog closes after success', async () => {
      await expect(dialog).toBeHidden({ timeout: 10_000 });
    });
  });
});
