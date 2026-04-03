import { test, expect } from '@playwright/test';

const EMPLOYEE_CREATED_MESSAGE = /Employee created successfully/i;
const EMPLOYEE_DELETED_MESSAGE = /Employee deleted successfully/i;

const TEST_TIMEOUT_MS = 3 * 60 * 1_000;
const TOAST_TIMEOUT_MS = 2.5 * 60 * 1_000;

const ALPHANUMERIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function employeeCodeFromDate(date: Date): string {
  return String(date.getTime()).slice(-10);
}

function randomAlphanumeric(length: number): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = '';
  for (let i = 0; i < length; i++) {
    out += ALPHANUMERIC[bytes[i]! % ALPHANUMERIC.length];
  }
  return out;
}

function buildCreateEmployeePayload() {
  const now = new Date();
  return {
    fullName: 'Playwright Test Employee',
    email: `e2e.${now.getTime()}@example.com`,
    employeeCode: employeeCodeFromDate(now),
    password: randomAlphanumeric(8),
    roleId: '1',
  };
}

test.describe('Employees page', () => {
  test('opens the create modal, submits the form, and shows a success toast', async ({ page }) => {
    test.setTimeout(TEST_TIMEOUT_MS);

    const data = buildCreateEmployeePayload();

    // ── 1. Navigate ──────────────────────────────────────────────────────────
    await test.step('Navigate to employees', async () => {
      await page.goto('/employees');
      await expect(page.getByRole('heading', { name: 'Employees' })).toBeVisible({
        timeout: 30_000,
      });
    });

    // ── 2. Open dialog ───────────────────────────────────────────────────────
    await test.step('Open "Create employee" dialog', async () => {
      await page.getByRole('button', { name: /create employee/i }).click();
      await expect(page.getByRole('dialog', { name: /create employee/i })).toBeVisible();
    });

    const dialog = page.getByRole('dialog', { name: /create employee/i });

    // ── 3. Fill form ─────────────────────────────────────────────────────────
    await test.step('Fill employee form', async () => {
      await dialog.getByLabel('Employee Full Name').fill(data.fullName);
      await dialog.getByLabel('Email', { exact: true }).fill(data.email);
      await dialog.getByLabel('Employee Code').fill(data.employeeCode);
      await dialog.getByLabel('Employee Password').fill(data.password);
      await dialog.getByLabel('Role ID').fill(data.roleId);
    });

    const successToast = page
      .locator('[data-sonner-toast][data-type="success"]')
      .filter({ hasText: EMPLOYEE_CREATED_MESSAGE });
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

  test('deletes an employee from the row actions menu', async ({ page }) => {
    test.setTimeout(TEST_TIMEOUT_MS);

    // ── 1. Navigate ──────────────────────────────────────────────────────────
    await test.step('Navigate to employees', async () => {
      await page.goto('/employees');
      await expect(page.getByRole('heading', { name: 'Employees' })).toBeVisible({
        timeout: 30_000,
      });
    });

    // ── 2. Wait for table data ───────────────────────────────────────────────
    await test.step('Wait for at least one data row', async () => {
      await page.locator('table tbody tr').first().waitFor({ state: 'visible', timeout: 30_000 });
    });

    const successToast = page
      .locator('[data-sonner-toast][data-type="success"]')
      .filter({ hasText: EMPLOYEE_DELETED_MESSAGE });
    const errorToast = page.locator('[data-sonner-toast][data-type="error"]');

    const toastResultPromise = Promise.race([
      successToast
        .waitFor({ state: 'visible', timeout: TOAST_TIMEOUT_MS })
        .then(() => 'success' as const),
      errorToast
        .waitFor({ state: 'visible', timeout: TOAST_TIMEOUT_MS })
        .then(() => 'error' as const),
    ]).catch(() => 'timeout' as const);

    // ── 3. Open row actions and delete ───────────────────────────────────────
    await test.step('Open row actions and click Delete', async () => {
      await page.getByRole('button', { name: 'Open menu' }).first().click();
      await page.getByRole('menuitem', { name: 'Delete' }).click();
    });

    // ── 4. Assert success toast ──────────────────────────────────────────────
    await test.step('Assert delete success toast', async () => {
      const result = await toastResultPromise;

      if (result === 'error') {
        const errorText = await errorToast.textContent().catch(() => '(could not read text)');
        throw new Error(`API returned an error toast: "${errorText?.trim()}"`);
      }
      if (result === 'timeout') {
        throw new Error('Neither a success nor an error toast appeared within the timeout window.');
      }
    });
  });
});
