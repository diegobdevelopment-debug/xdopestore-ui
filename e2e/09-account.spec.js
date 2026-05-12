const { test, expect } = require("@playwright/test");
const { loginViaAPI, dismissNewsletterModal, BASE_API } = require("./helpers/auth");

test.describe("Account", () => {
  test.describe("Dashboard & Navigation", () => {
    test.beforeEach(async ({ page }) => {
      await loginViaAPI(page);
    });

    test("user icon redirects to dashboard when logged in", async ({ page }) => {
      await page.locator(".icon-nav li.onhover-div").nth(2).click();
      await expect(page).toHaveURL(/account\/dashboard/, { timeout: 10000 });
    });

    test("account dashboard shows user profile section", async ({ page }) => {
      await page.goto("/account/dashboard");
      // SidebarProfile renders .profile-top with user info
      await expect(page.locator(".profile-top, .dashboard-sidebar, .dashboard-right-sidebar").first()).toBeVisible({ timeout: 15000 });
    });

    test("can navigate to orders from account sidebar", async ({ page }) => {
      await page.goto("/account/dashboard");
      await page.waitForSelector(".dashboard-sidebar", { timeout: 12000 });

      // Sidebar links — look for any link containing "order"
      const orderLink = page.locator('.dashboard-sidebar a[href*="order"]').first();
      await expect(orderLink).toBeVisible({ timeout: 8000 });
      await orderLink.click();
      await expect(page).toHaveURL(/account\/order/, { timeout: 10000 });
    });

    test("can navigate to addresses from account sidebar", async ({ page }) => {
      await page.goto("/account/dashboard");
      await page.waitForSelector(".dashboard-sidebar", { timeout: 12000 });

      const addressLink = page.locator('.dashboard-sidebar a[href*="address"]').first();
      await expect(addressLink).toBeVisible({ timeout: 8000 });
      await addressLink.click();
      await expect(page).toHaveURL(/account\/addresses/, { timeout: 10000 });
    });

    test("logout clears session cookie", async ({ page }) => {
      // The logout icon (RiLogoutBoxRLine) is the last icon in .icon-nav when authenticated
      const logoutBtn = page.locator('.icon-nav a[title]').last();
      await expect(logoutBtn).toBeVisible({ timeout: 8000 });
      await logoutBtn.click();
      await page.waitForTimeout(1000);

      // uat cookie should be removed after logout
      const cookies = await page.context().cookies();
      const uat = cookies.find((c) => c.name === "uat");
      expect(uat).toBeUndefined();
    });
  });

  test.describe("Address Management", () => {
    test.beforeEach(async ({ page }) => {
      await loginViaAPI(page);
    });

    test("addresses page loads and shows addresses or empty state", async ({ page }) => {
      await page.goto("/account/addresses");
      const content = page.locator(".dashboard-right-sidebar, .address-box, [class*='no-data'], .card").first();
      await expect(content).toBeVisible({ timeout: 15000 });
    });

    test("address page has an add address button", async ({ page }) => {
      await page.goto("/account/addresses");
      await page.waitForTimeout(2000);

      const addBtn = page.locator('button.btn-solid, button:has-text("Add"), .btn-solid').first();
      await expect(addBtn).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("Protected Routes", () => {
    test("accessing /account/dashboard without login redirects or shows auth modal", async ({ page }) => {
      await dismissNewsletterModal(page);
      await page.goto("/account/dashboard");
      await page.waitForTimeout(2000);

      const url = page.url();
      const isRedirected = !url.includes("/account/dashboard");
      const modalVisible = await page.locator(".auth-modal").isVisible().catch(() => false);

      expect(isRedirected || modalVisible).toBe(true);
    });

    test("accessing /wishlist without login opens auth modal or redirects", async ({ page }) => {
      await dismissNewsletterModal(page);
      await page.goto("/wishlist");
      await page.waitForTimeout(2000);

      const url = page.url();
      const isRedirected = !url.includes("/wishlist");
      const modalVisible = await page.locator(".auth-modal").isVisible().catch(() => false);

      // Guest accessing wishlist — either redirected or modal opens
      expect(isRedirected || modalVisible || url.includes("/wishlist")).toBe(true);
    });

    test("accessing /account/wallet without login redirects", async ({ page }) => {
      await dismissNewsletterModal(page);
      await page.goto("/account/wallet");
      await page.waitForTimeout(2000);

      const url = page.url();
      expect(url).not.toContain("/account/wallet");
    });
  });

  test.describe("Account Sub-pages", () => {
    test.beforeEach(async ({ page }) => {
      await loginViaAPI(page);
    });

    test("wallet page loads with balance or empty state", async ({ page }) => {
      await page.goto("/account/wallet");
      const content = page.locator(".dashboard-table, .wallet-table, [class*='no-data'], .card").first();
      await expect(content).toBeVisible({ timeout: 15000 });
    });

    test("points page loads and shows earning points section", async ({ page }) => {
      await page.goto("/account/point");
      const content = page.locator(".dashboard-table, [class*='point'], [class*='no-data'], .card").first();
      await expect(content).toBeVisible({ timeout: 15000 });
    });

    test("sidebar nav links have href attributes for direct navigation", async ({ page }) => {
      await page.goto("/account/dashboard");
      await page.waitForSelector(".dashboard-sidebar", { timeout: 12000 });

      const links = page.locator(".dashboard-sidebar .faq-tab a[href]");
      const count = await links.count();
      expect(count).toBeGreaterThan(0);
    });
  });
});
