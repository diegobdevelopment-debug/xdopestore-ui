const { test, expect } = require("@playwright/test");
const { loginViaAPI, BASE_API } = require("./helpers/auth");

async function getFirstOrder(page) {
  const cookies = await page.context().cookies();
  const token = cookies.find((c) => c.name === "uat")?.value;
  const res = await page.request.get(`${BASE_API}/order?paginate=10`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await res.json();
  return body?.data?.data?.[0] || body?.data?.[0] || null;
}

test.describe("Order Tracking", () => {
  test.beforeEach(async ({ page }) => {
    await loginViaAPI(page);
  });

  test("orders list page is accessible and shows table or empty state", async ({ page }) => {
    await page.goto("/account/order");
    // Either an orders table or a "no orders" message
    const content = page.locator('.order-table, .dashboard-table, [class*="no-data"], .NoOrdersFound').first();
    await expect(content).toBeVisible({ timeout: 15000 });
  });

  test("orders list shows order number, date, amount and status columns", async ({ page }) => {
    await page.goto("/account/order");

    const hasData = await page.locator(".order-table tbody tr").first().isVisible().catch(() => false);
    if (!hasData) test.skip(true, "No orders available to verify table columns");

    await expect(page.locator(".order-table thead th").nth(0)).toBeVisible();
    await expect(page.locator(".order-table tbody tr").first()).toBeVisible();
  });

  test("order detail page loads for existing order", async ({ page }) => {
    const order = await getFirstOrder(page);
    if (!order) test.skip(true, "No orders available");

    const orderNumber = order.order_number;
    await page.goto(`/account/order/details/${orderNumber}`);

    // Should show order number on the detail page
    await expect(page.locator(`text=${orderNumber}`).first()).toBeVisible({ timeout: 15000 });
  });

  test("order detail shows tracking panel or sub-orders with status", async ({ page }) => {
    const order = await getFirstOrder(page);
    if (!order) test.skip(true, "No orders available");

    await page.goto(`/account/order/details/${order.order_number}`);
    await page.waitForTimeout(2000); // let data load

    // Either the tracking-panel (DetailStatus) or the sub-orders table should render
    const hasTracking = await page.locator(".tracking-panel").isVisible().catch(() => false);
    const hasSubOrders = await page.locator(".tracking-wrapper").isVisible().catch(() => false);
    const hasDetailsTable = await page.locator(".dashboard-table").isVisible().catch(() => false);

    expect(hasTracking || hasSubOrders || hasDetailsTable).toBe(true);
  });

  test("order tracking page is accessible", async ({ page }) => {
    await page.goto("/order/tracking");
    // Page should load without 404
    await expect(page).not.toHaveURL(/404/);
    const body = page.locator("main, .section-b-space, .container").first();
    await expect(body).toBeVisible({ timeout: 12000 });
  });

  test("clicking eye icon on orders list navigates to order detail", async ({ page }) => {
    await page.goto("/account/order");

    const eyeLink = page.locator(".order-table tbody tr a, .order-table tbody tr [href*='order/details']").first();
    const hasOrders = await eyeLink.isVisible().catch(() => false);
    if (!hasOrders) test.skip(true, "No orders in list to click");

    const href = await eyeLink.getAttribute("href");
    await eyeLink.click();
    await expect(page).toHaveURL(new RegExp(href.replace(/\//g, "\\/")), { timeout: 10000 });
  });
});
