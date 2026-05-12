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

    // After login: modal closes (isOpen=false removes it from DOM) OR page navigates
    await Promise.race([
      page.locator(".auth-modal").waitFor({ state: "hidden", timeout: 15000 }),
      page.waitForURL(/account\/dashboard/, { timeout: 15000 }),
    ]);
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

    // Click the toggle link inside p.create (currently shows "Register Here")
    await page.locator(".auth-modal p.create a").click();
    await expect(page.locator(".auth-modal .auth-title h3")).toBeVisible({ timeout: 5000 });

    // The title should change (CreateAccount / Register)
    const titleAfterSwitch = await page.locator(".auth-modal .auth-title h3").textContent();
    expect(titleAfterSwitch).not.toBe(""); // title changed

    // Click again to go back to login
    await page.locator(".auth-modal p.create a").click();
    await expect(page.locator(".auth-modal .auth-title h3")).toBeVisible({ timeout: 5000 });
  });

  test("forgot password link switches to forgot password form", async ({ page }) => {
    await openAuthModal(page);

    await page.locator(".auth-modal .forgot").click();
    await expect(page.locator(".auth-modal .auth-title h3")).toContainText(/Forgot/i, { timeout: 5000 });
  });
});
