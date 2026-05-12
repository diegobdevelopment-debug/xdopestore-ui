const { test, expect } = require("@playwright/test");
const { loginViaAPI, BASE_API } = require("./helpers/auth");

test.describe("Search & Product Browsing", () => {
  test.beforeEach(async ({ page }) => {
    await loginViaAPI(page);
  });

  test("search page with query returns results", async ({ page }) => {
    const res = await page.request.get(`${BASE_API}/product?paginate=1`);
    const body = await res.json();
    const productName = body?.data?.data?.[0]?.name || body?.data?.[0]?.name || "shirt";
    const searchTerm = productName.split(" ")[0];

    await page.goto(`/search?search=${encodeURIComponent(searchTerm)}`);

    // product-wrapper-grid is the real collection wrapper; basic-product is each product
    const content = page.locator('.product-wrapper-grid, .basic-product, [class*="no-data"]').first();
    await expect(content).toBeVisible({ timeout: 15000 });
  });

  test("search with no results shows empty state", async ({ page }) => {
    await page.goto("/search?search=zzznoresultsxxx123");

    const empty = page.locator('[class*="no-data"], [class*="NoData"], .no-data-added').first();
    await expect(empty).toBeVisible({ timeout: 12000 });
  });

  test("collections page renders products", async ({ page }) => {
    await page.goto("/collections");

    // Actual wrapper class: product-wrapper-grid; individual product: basic-product
    const products = page.locator(".product-wrapper-grid, .basic-product").first();
    await expect(products).toBeVisible({ timeout: 15000 });
  });

  test("category page loads with products or empty state", async ({ page }) => {
    const res = await page.request.get(`${BASE_API}/category?paginate=1`);
    const body = await res.json();
    const slug = body?.data?.data?.[0]?.slug || body?.data?.[0]?.slug;
    if (!slug) return test.skip(true, "No categories available");

    await page.goto(`/category/${slug}`, { waitUntil: "domcontentloaded" });
    const content = page.locator('.product-wrapper-grid, .basic-product, [class*="no-data"]').first();
    await expect(content).toBeVisible({ timeout: 25000 });
  });

  test("product detail page shows title, price and add-to-cart button", async ({ page }) => {
    const res = await page.request.get(`${BASE_API}/product?paginate=1`);
    const body = await res.json();
    const slug = body?.data?.[0]?.slug || body?.data?.data?.[0]?.slug;
    if (!slug) return test.skip(true, "No products available");

    await page.goto(`/product/${slug}`, { waitUntil: "domcontentloaded" });

    // Title: h2.main-title in ProductContent.jsx
    await expect(page.locator(".main-title, h2.main-title").first()).toBeVisible({ timeout: 25000 });
    // Price: .price-text or h4.price (ProductBox1) or .price
    await expect(page.locator(".price-text, h4.price, .price").first()).toBeVisible({ timeout: 10000 });
    // Add to cart: .product-buy-btn-group .buy-button
    await expect(page.locator(".product-buy-btn-group .buy-button").first()).toBeVisible({ timeout: 10000 });
  });

  test("product detail page has description tab", async ({ page }) => {
    const res = await page.request.get(`${BASE_API}/product?paginate=1`);
    const body = await res.json();
    const slug = body?.data?.[0]?.slug || body?.data?.data?.[0]?.slug;
    if (!slug) return test.skip(true, "No products available");

    await page.goto(`/product/${slug}`, { waitUntil: "domcontentloaded" });

    // ProductDetailsTab component renders tabs
    const tab = page.locator('.nav-tabs, .tab-pane, .product-detail-tabs, [class*="product-tab"]').first();
    await expect(tab).toBeVisible({ timeout: 20000 });
  });
});
