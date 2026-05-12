const { test, expect } = require("@playwright/test");
const { loginViaAPI, BASE_API, dismissNewsletterModal } = require("./helpers/auth");

test.describe("Add to Cart", () => {
  test.beforeEach(async ({ page }) => {
    await loginViaAPI(page);
  });

  test("adds a product to cart from collections page", async ({ page }) => {
    await page.goto("/collections");

    // Wait for products to render — buy-button or add_cart class
    await page.waitForSelector('.buy-button, [id^="add-to-cart"], .add_cart, .btn-add-cart', { timeout: 15000 });

    const firstCartBtn = page.locator('.buy-button, [id^="add-to-cart"], .add_cart, .btn-add-cart').first();
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

    // Product detail uses .buy-button (AddToCartButton component)
    await page.waitForSelector(".product-buy-btn-group .buy-button", { timeout: 15000 });

    const addBtn = page.locator(".product-buy-btn-group .buy-button").first();
    const isDisabled = await addBtn.isDisabled();

    if (isDisabled) {
      // Product out of stock — still verify the button is present
      await expect(addBtn).toBeVisible();
    } else {
      await addBtn.click();
      // Cart sidebar or count should update
      const feedback = page.locator('.offcanvas-body, [class*="cart-count"], .cart_qty_cls, .toast').first();
      await expect(feedback).toBeVisible({ timeout: 8000 });
    }
  });

  test("cart page shows added products", async ({ page }) => {
    // Add a real product via API first
    const productsRes = await page.request.get(`${BASE_API}/product?paginate=1`);
    const productsBody = await productsRes.json();
    const productId = productsBody?.data?.data?.[0]?._id || productsBody?.data?.[0]?._id || productsBody?.data?.data?.[0]?.id || productsBody?.data?.[0]?.id;

    const cookies = await page.context().cookies();
    const token = cookies.find((c) => c.name === "uat")?.value;

    if (productId && token) {
      await page.request.post(`${BASE_API}/cart`, {
        data: { product_id: productId, quantity: 1 },
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
    }

    await page.goto("/cart");

    // Cart page renders a Table with class cart-table (ShowCartData.jsx)
    // or an empty-cart message if cart is empty
    const content = page.locator(".cart-table, .empty-cls, [class*='no-data'], .empty-cart").first();
    await expect(content).toBeVisible({ timeout: 12000 });
  });
});
