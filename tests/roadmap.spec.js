import { test, expect } from '@playwright/test';

test('roadmap dan roadmap detail tampil', async ({ page }) => {

  // LOGIN
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

  // ROADMAP
  await page.goto(
    'http://localhost:5173/roadmap'
  );

  await expect(page).toHaveURL(
    /roadmap/
  );

  // screenshot roadmap
  await page.screenshot({
    path: 'roadmap-page.png',
    fullPage: true
  });

  // tunggu roadmap load
  await page.waitForTimeout(3000);

  // klik roadmap kedua
  await page.locator('a').nth(1).click();

  // tunggu detail
  await page.waitForTimeout(3000);

  // screenshot detail
  await page.screenshot({
    path: 'roadmap-detail.png',
    fullPage: true
  });

});