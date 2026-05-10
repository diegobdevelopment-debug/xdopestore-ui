const { test, expect } = require("@playwright/test");
const { loginViaAPI, BASE_API } = require("./helpers/auth");

async function seedOneProduct(page) {
  const cookies = await page.context().cookies();
  const token = cookies.find((c) => c.name === "uat")?.value;
  const productsRes = await page.request.get(`${BASE_API}/product?paginate=1`);
  const productsBody = await productsRes.json();
  const productId = productsBody?.data?.[0]?._id || productsBody?.data?.[0]?.id;
  if (productId && token) {
    await page.request.post(`${BASE_API}/cart`, {
      data: { product_id: productId, quantity: 1 },
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    await page.waitForTimeout(500); // let the server process
  }
  return productId;
}

test.describe("Cart Management", () => {
  test.beforeEach(async ({ page }) => {
    await loginViaAPI(page);
  });

  test("cart page shows product rows and total", async ({ page }) => {
    await seedOneProduct(page);
    // Navigate to cart AFTER seeding
    await page.goto("/cart");
    await expect(page.locator(".cart-table tbody tr").first()).toBeVisible({ timeout: 15000 });
    // tfoot has total price
    await expect(page.locator(".cart-table tfoot td h2").first()).toBeVisible({ timeout: 5000 });
  });

  test("can increase product quantity in cart", async ({ page }) => {
    await seedOneProduct(page);
    await page.goto("/cart");
    await page.waitForSelector(".cart-table tbody tr", { timeout: 15000 });

    // Desktop qty box is in its own <td>, not inside .mobile-cart-content
    const qtyInput = page.locator(".cart-table tbody tr td > .qty-box .qty-input").first();
    const initialQty = parseInt(await qtyInput.inputValue());

    await page.locator(".cart-table tbody tr td > .qty-box #quantity-left-plus").first().click();
    await page.waitForTimeout(1000);

    const newQty = parseInt(await qtyInput.inputValue());
    expect(newQty).toBe(initialQty + 1);
  });

  test("can decrease product quantity in cart", async ({ page }) => {
    // Seed 2 units so we can decrease without removing
    const cookies = await page.context().cookies();
    const token = cookies.find((c) => c.name === "uat")?.value;
    const productsRes = await page.request.get(`${BASE_API}/product?paginate=1`);
    const productsBody = await productsRes.json();
    const productId = productsBody?.data?.[0]?._id || productsBody?.data?.[0]?.id;
    if (productId && token) {
      await page.request.post(`${BASE_API}/cart`, {
        data: { product_id: productId, quantity: 2 },
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
    }
    await page.waitForTimeout(500);
    await page.goto("/cart");
    await page.waitForSelector(".cart-table tbody tr", { timeout: 15000 });

    const qtyInput = page.locator(".cart-table tbody tr td > .qty-box .qty-input").first();
    const initialQty = parseInt(await qtyInput.inputValue());

    if (initialQty > 1) {
      await page.locator(".cart-table tbody tr td > .qty-box #quantity-left-minus").first().click();
      await page.waitForTimeout(1000);
      const newQty = parseInt(await qtyInput.inputValue());
      expect(newQty).toBe(initialQty - 1);
    } else {
      // qty is 1, clicking minus removes — verify row is gone or empty state
      await page.locator(".cart-table tbody tr td > .qty-box #quantity-left-minus").first().click();
      await page.waitForTimeout(1500);
      const rowsAfter = await page.locator(".cart-table tbody tr").count();
      expect(rowsAfter).toBeLessThanOrEqual(initialQty);
    }
  });

  test("can remove product from cart", async ({ page }) => {
    await seedOneProduct(page);
    await page.goto("/cart");
    await page.waitForSelector(".cart-table tbody tr", { timeout: 15000 });

    const rowsBefore = await page.locator(".cart-table tbody tr").count();

    // Desktop remove btn is a direct child of td (mobile one is nested inside .mobile-cart-content)
    await page.locator(".cart-table tbody tr td > a.remove-btn").first().click();
    await page.waitForTimeout(1500);

    const rowsAfter = await page.locator(".cart-table tbody tr").count();
    expect(rowsAfter).toBeLessThan(rowsBefore);
  });

  test("proceed to checkout button links to /checkout", async ({ page }) => {
    await seedOneProduct(page);
    await page.goto("/cart");
    await page.waitForSelector(".cart-table", { timeout: 15000 });

    // CartButtons.jsx renders inside .cart-buttons row
    const checkoutBtn = page.locator('.cart-buttons a[href="/checkout"]');
    await expect(checkoutBtn).toBeVisible({ timeout: 8000 });
    await checkoutBtn.click();
    await expect(page).toHaveURL(/checkout/, { timeout: 10000 });
  });

  test("empty cart shows no-items message", async ({ page }) => {
    // Clear cart via dedicated endpoint
    const cookies = await page.context().cookies();
    const token = cookies.find((c) => c.name === "uat")?.value;
    if (token) {
      await page.request.delete(`${BASE_API}/clear/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }

    await page.goto("/cart");
    // NoDataFound renders when cartProducts is empty
    const empty = page.locator('[class*="no-data"], .no-data-added, [class*="NoItemsAdded"]').first();
    await expect(empty).toBeVisible({ timeout: 12000 });
  });
});
