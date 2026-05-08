const { test, expect } = require("@playwright/test");
const { TEST_EMAIL, TEST_PASSWORD } = require("./helpers/auth");

test.describe("Login", () => {
  test("shows login form fields", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#review")).toBeVisible(); // password field id
    await expect(page.locator('button[type="submit"], .btn-solid')).toBeVisible();
  });

  test("logs in with valid credentials and redirects to dashboard", async ({ page }) => {
    await page.goto("/auth/login");

    await page.locator("#email").fill(TEST_EMAIL);
    await page.locator("#review").fill(TEST_PASSWORD);
    await page.locator('button[type="submit"], .btn-solid').first().click();

    // Should redirect to /account/dashboard (or wherever CallBackUrl points)
    await expect(page).toHaveURL(/account\/dashboard/, { timeout: 15000 });
  });

  test("shows error on wrong password", async ({ page }) => {
    await page.goto("/auth/login");

    await page.locator("#email").fill(TEST_EMAIL);
    await page.locator("#review").fill("wrongpassword123!");
    await page.locator('button[type="submit"], .btn-solid').first().click();

    // Error message should appear (toast or inline)
    const errorVisible = await page
      .locator('.Toastify__toast--error, .invalid-feedback, [class*="error"], [class*="alert"]')
      .first()
      .waitFor({ timeout: 8000 })
      .then(() => true)
      .catch(() => false);

    expect(errorVisible).toBe(true);
  });

  test("blocks submit with empty fields", async ({ page }) => {
    await page.goto("/auth/login");

    // Clear pre-filled defaults and try to submit
    await page.locator("#email").clear();
    await page.locator("#review").clear();
    await page.locator('button[type="submit"], .btn-solid').first().click();

    // Should NOT navigate away
    await expect(page).toHaveURL(/auth\/login/);
  });
});
