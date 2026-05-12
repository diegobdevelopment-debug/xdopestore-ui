const { test, expect } = require("@playwright/test");
const { dismissNewsletterModal, openAuthModal, ensureTestUser, BASE_API } = require("./helpers/auth");

const uniqueEmail = () => `test_${Date.now()}@xdope.com`;

test.describe("Registration (auth modal)", () => {
  test.beforeEach(async ({ page }) => {
    await dismissNewsletterModal(page);
    await page.goto("/");
  });

  test("register form shows all required fields", async ({ page }) => {
    await openAuthModal(page);
    await page.locator(".auth-modal p.create a").click();

    await expect(page.locator(".auth-modal #fname")).toBeVisible({ timeout: 5000 });
    await expect(page.locator(".auth-modal #email")).toBeVisible();
    await expect(page.locator(".auth-modal #review")).toBeVisible();
    await expect(page.locator(".auth-modal #lname")).toBeVisible();
    await expect(page.locator(".auth-modal #flexCheckDefault")).toBeAttached();
  });

  test("shows validation errors on empty submit", async ({ page }) => {
    await openAuthModal(page);
    await page.locator(".auth-modal p.create a").click();
    await page.waitForTimeout(300);

    // Focus then blur the name field — Formik marks it touched and runs validation
    await page.locator(".auth-modal #fname").click();
    await page.locator(".auth-modal #email").click();

    await expect(page.locator(".auth-modal .invalid-feedback").first()).toBeVisible({ timeout: 8000 });
  });

  test("shows error when passwords do not match", async ({ page }) => {
    await openAuthModal(page);
    await page.locator(".auth-modal p.create a").click();

    await page.locator(".auth-modal #fname").fill("Test User");
    await page.locator(".auth-modal #email").fill(uniqueEmail());
    await page.locator(".auth-modal #review").fill("Password@123");
    await page.locator(".auth-modal #lname").fill("Different@456");
    await page.locator(".auth-modal input[name='phone']").fill("9999999999");
    // Checkbox uses custom animation — force check
    await page.locator(".auth-modal #flexCheckDefault").check({ force: true });
    await page.locator(".auth-modal button[type='submit']").click({ force: true });

    await expect(page.locator(".auth-modal .invalid-feedback").first()).toBeVisible({ timeout: 8000 });
  });

  test("shows error when email already exists", async ({ page }) => {
    // Ensure the consumer user exists before trying to register as them
    await ensureTestUser(page);
    await openAuthModal(page);
    await page.locator(".auth-modal p.create a").click();

    await page.locator(".auth-modal #fname").fill("Test User");
    await page.locator(".auth-modal #email").fill("consumer@xdope.com");
    await page.locator(".auth-modal input[name='phone']").fill("9999999999");
    await page.locator(".auth-modal #review").fill("Consumer@123");
    await page.locator(".auth-modal #lname").fill("Consumer@123");
    await page.locator(".auth-modal #flexCheckDefault").check({ force: true });
    await page.locator(".auth-modal button[type='submit']").click({ force: true });

    // API returns error — shown in .alert-danger.login-alert
    await expect(page.locator(".auth-modal .alert-danger, .auth-modal .invalid-feedback").first()).toBeVisible({ timeout: 20000 });
  });

  test("registers new user successfully", async ({ page }) => {
    const email = uniqueEmail();

    await openAuthModal(page);
    await page.locator(".auth-modal p.create a").click();

    await page.locator(".auth-modal #fname").fill("New Test User");
    await page.locator(".auth-modal #email").fill(email);
    await page.locator(".auth-modal input[name='phone']").fill("9999999999");
    await page.locator(".auth-modal #review").fill("TestPass@123");
    await page.locator(".auth-modal #lname").fill("TestPass@123");
    await page.locator(".auth-modal #flexCheckDefault").check({ force: true });
    await page.locator(".auth-modal button[type='submit']").click({ force: true });

    await Promise.race([
      page.locator(".auth-modal").waitFor({ state: "hidden", timeout: 15000 }),
      page.locator(".Toastify__toast--success, .toast-success").waitFor({ timeout: 15000 }),
    ]);
  });
});
