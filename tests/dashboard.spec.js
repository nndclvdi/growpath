import { test, expect } from '@playwright/test';

test('dashboard tampil', async ({ page }) => {

  // login user
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

  // tunggu redirect
  await page.waitForTimeout(5000);

  // buka dashboard
  await page.goto(
    'http://localhost:5173/dashboard'
  );

  // cek URL dashboard
  await expect(page).toHaveURL(
    /dashboard/
  );

  // screenshot dashboard
  await page.screenshot({
    path: 'dashboard.png',
    fullPage: true
  });

});