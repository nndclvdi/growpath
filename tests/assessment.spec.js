import { test, expect } from '@playwright/test';

test('assessment pages tampil', async ({ page }) => {

  // =========================
  // LOGIN
  // =========================
  await page.goto('http://localhost:5173/login');

  await page.fill(
    'input[type="email"]',
    'fahrezireza26@gmail.com'
  );

  await page.fill(
    'input[type="password"]',
    '123456'
  );

  await page.click(
    'button[type="submit"]'
  );

  // tunggu sampai dashboard
  await page.waitForURL(
    '**/dashboard'
  );

  // =========================
  // ASSESSMENT LIST
  // =========================
  await page.goto(
    'http://localhost:5173/assessment-list'
  );

  await expect(page).toHaveURL(
    /assessment-list/
  );

  // =========================
  // ASSESSMENT TAKE
  // =========================
  await page.goto(
    'http://localhost:5173/assessment-take'
  );

  await expect(page).toHaveURL(
    /assessment-take/
  );

  // =========================
  // ASSESSMENT RESULT
  // =========================
  await page.goto(
    'http://localhost:5173/assessment-result'
  );

  await expect(page).toHaveURL(
    /assessment-result/
  );

});