const { test, expect } = require("@playwright/test");
const { loginViaAPI, BASE_API, dismissNewsletterModal } = require("./helpers/auth");

test.describe("Add to Cart", () => {
  test.beforeEach(async ({ page }) => {
    await loginViaAPI(page);
  });

  test("adds a product to cart from collections page", async ({ page }) => {
    await page.goto("/collections");

    // Wait for products to render
    await page.waitForSelector('[id^="add-to-cart"], .add_cart, .btn-add-cart', { timeout: 15000 });

    const firstCartBtn = page.locator('[id^="add-to-cart"], .add_cart, .btn-add-cart').first();
    await firstCartBtn.click();

    // Cart badge / count should appear or increment
    const cartBadge = page.locator('.cart-badge, .badge, [class*="cart-count"], .cart_qty_cls').first();
    await expect(cartBadge).toBeVisible({ timeout: 8000 });
  });

  test("adds a product to cart from product detail page", async ({ page }) => {
    // Get first available product slug via API
    const res = await page.request.get(`${BASE_API}/product?paginate=1`);
    const body = await res.json();
    const slug = body?.data?.data?.[0]?.slug || body?.data?.[0]?.slug;

    if (!slug) test.skip(true, "No products available in API");

    await page.goto(`/product/${slug}`);
    await page.waitForSelector('[id^="add-to-cart"], .add_cart, .btn-add-cart', { timeout: 15000 });

    const addBtn = page.locator('[id^="add-to-cart"], .add_cart').first();
    await addBtn.click();

    // Cart canvas or count change
    const feedback = page.locator('.cart-badge, .offcanvas-body, [class*="cart-count"], .cart_qty_cls').first();
    await expect(feedback).toBeVisible({ timeout: 8000 });
  });

  test("cart page shows added products", async ({ page }) => {
    // Add via API directly first
    const cookieVal = (await page.context().cookies()).find((c) => c.name === "uat")?.value;
    await page.request.post(`${BASE_API}/cart`, {
      data: { product_id: 1, quantity: 1 },
      headers: { Authorization: `Bearer ${cookieVal}`, "Content-Type": "application/json" },
    });

    await page.goto("/cart");
    // Table or product list should be present
    const cartContent = page.locator('.cart-table, .cart-item, [class*="cart-product"], tbody tr').first();
    await expect(cartContent).toBeVisible({ timeout: 12000 });
  });
});
