import { test, expect } from '@playwright/test';

test('admin pages tampil', async ({ page }) => {

  // =========================
  // LOGIN ADMIN
  // =========================
  await page.goto('http://localhost:5173/login-admin');

  await page.fill(
    'input[type="email"]',
    'superadmin@growpath.com'
  );

  await page.fill(
    'input[type="password"]',
    'admin123'
  );

  await page.click(
    'button[type="submit"]'
  );

  // tunggu redirect admin dashboard
  await page.waitForURL(
    '**/admin/dashboard'
  );

  // cek berhasil login
  await expect(page).toHaveURL(
    /admin\/dashboard/
  );

  // screenshot dashboard
  await page.screenshot({
    path: 'admin-dashboard.png',
    fullPage: true
  });

  // =========================
  // MANAGE ASSESSMENT
  // =========================
  await page.goto(
    'http://localhost:5173/manage-assessment'
  );

  // =========================
  // MANAGE COURSES
  // =========================
  await page.goto(
    'http://localhost:5173/manage-courses'
  );

  // =========================
  // MANAGE TALENT MAPPING
  // =========================
  await page.goto(
    'http://localhost:5173/manage-talent-mapping'
  );

  // =========================
  // MANAGE USER
  // =========================
  await page.goto(
    'http://localhost:5173/manage-user'
  );

  // =========================
  // REGISTER ADMIN
  // =========================
  await page.goto(
    'http://localhost:5173/register-admin'
  );

  // =========================
  // REPORTS
  // =========================
  await page.goto(
    'http://localhost:5173/reports'
  );

  // =========================
  // SETTINGS
  // =========================
  await page.goto(
    'http://localhost:5173/settings'
  );

  // =========================
  // USER INSIGHT
  // =========================
  await page.goto(
    'http://localhost:5173/user-insight'
  );

  // screenshot akhir
  await page.screenshot({
    path: 'admin-pages.png',
    fullPage: true
  });

});