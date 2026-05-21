import { test, expect } from '@playwright/test';

test('user bisa edit profile', async ({ page }) => {

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

  // tunggu dashboard
  await page.waitForURL('**/dashboard');

  // =========================
  // PROFILE
  // =========================
  await page.goto(
    'http://localhost:5173/profile'
  );

  // tunggu profile tampil
  await page.waitForTimeout(3000);

  // screenshot profile
  await page.screenshot({
    path: 'profile-page.png',
    fullPage: true
  });

  // cek halaman profile tampil
  await expect(page).toHaveURL(
    /profile/
  );

});