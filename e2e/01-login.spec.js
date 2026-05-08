const { test, expect } = require("@playwright/test");
const { dismissNewsletterModal, openAuthModal, TEST_EMAIL, TEST_PASSWORD } = require("./helpers/auth");

test.describe("Login (auth modal)", () => {
  test.beforeEach(async ({ page }) => {
    await dismissNewsletterModal(page);
    await page.goto("/");
  });

  test("clicking user icon opens the auth modal with login form", async ({ page }) => {
    await openAuthModal(page);
    await expect(page.locator(".auth-modal #email")).toBeVisible();
    await expect(page.locator(".auth-modal #password")).toBeVisible();
    await expect(page.locator(".auth-modal button[type='submit']")).toBeVisible();
  });

  test("logs in with valid credentials and closes the modal", async ({ page }) => {
    await openAuthModal(page);

    await page.locator(".auth-modal #email").fill(TEST_EMAIL);
    await page.locator(".auth-modal #password").fill(TEST_PASSWORD);
    await page.locator(".auth-modal button[type='submit']").click();

    // Modal should close after successful login
    await expect(page.locator(".auth-modal")).not.toBeVisible({ timeout: 15000 });
  });

  test("shows error alert on wrong password", async ({ page }) => {
    await openAuthModal(page);

    await page.locator(".auth-modal #email").fill(TEST_EMAIL);
    await page.locator(".auth-modal #password").fill("wrongpassword123!");
    await page.locator(".auth-modal button[type='submit']").click();

    await expect(page.locator(".auth-modal .alert-danger.login-alert")).toBeVisible({ timeout: 8000 });
  });

  test("shows validation errors with empty fields", async ({ page }) => {
    await openAuthModal(page);

    await page.locator(".auth-modal #email").clear();
    await page.locator(".auth-modal #password").clear();
    await page.locator(".auth-modal button[type='submit']").click();

    // Modal stays open and shows inline validation
    await expect(page.locator(".auth-modal")).toBeVisible();
    await expect(page.locator(".auth-modal .invalid-feedback").first()).toBeVisible({ timeout: 5000 });
  });

  test("can switch to register form and back", async ({ page }) => {
    await openAuthModal(page);

    // Click "Register Here" link
    await page.locator(".auth-modal a:has-text('Register')").click();
    await expect(page.locator(".auth-modal .auth-title h3")).toContainText(/Create|Register/i, { timeout: 5000 });

    // Click "Login Here" link to go back
    await page.locator(".auth-modal a:has-text('Login')").click();
    await expect(page.locator(".auth-modal .auth-title h3")).toContainText(/Sign|Login/i, { timeout: 5000 });
  });

  test("forgot password link switches to forgot password form", async ({ page }) => {
    await openAuthModal(page);

    await page.locator(".auth-modal .forgot").click();
    await expect(page.locator(".auth-modal .auth-title h3")).toContainText(/Forgot/i, { timeout: 5000 });
  });
});
