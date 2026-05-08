/**
 * Shared auth helpers for e2e tests.
 */

const BASE_API = process.env.API_URL || "http://localhost:5000";
const TEST_EMAIL = process.env.TEST_EMAIL || "consumer@xdope.com";
const TEST_PASSWORD = process.env.TEST_PASSWORD || "Consumer@123";

/**
 * Sets the `newsletter` cookie so the modal never appears during tests.
 * Call this before any page.goto() that loads the site.
 */
async function dismissNewsletterModal(page) {
  await page.context().addCookies([
    {
      name: "newsletter",
      value: "true",
      domain: "localhost",
      path: "/",
      expires: Math.floor(Date.now() / 1000) + 86400 * 7,
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
    },
  ]);
}

/**
 * Calls the login API directly and injects the `uat` cookie into the browser context.
 * Also sets the newsletter cookie to avoid the popup.
 */
async function loginViaAPI(page) {
  await dismissNewsletterModal(page);

  const res = await page.request.post(`${BASE_API}/login`, {
    data: { email: TEST_EMAIL, password: TEST_PASSWORD },
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  });

  if (!res.ok()) {
    throw new Error(`Login API failed: ${res.status()} ${await res.text()}`);
  }

  const body = await res.json();
  const token = body?.access_token || body?.token || body?.data?.access_token || body?.data?.token;
  if (!token) throw new Error("No token in login response: " + JSON.stringify(body));

  await page.context().addCookies([
    {
      name: "uat",
      value: token,
      domain: "localhost",
      path: "/",
      expires: Math.floor(Date.now() / 1000) + 86400,
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
    },
  ]);

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate((data) => {
    localStorage.setItem("account", JSON.stringify(data));
  }, body?.data || body);

  return body;
}

/**
 * Opens the auth modal via the user icon in the header.
 * Waits until the modal is visible.
 */
/**
 * Opens the auth modal via the user icon (3rd li.onhover-div in .icon-nav).
 * Waits until the modal is visible.
 */
async function openAuthModal(page) {
  // The user icon is the 3rd li.onhover-div inside .icon-nav
  // (heart = 1st, cart = 2nd, user = 3rd)
  await page.locator(".icon-nav li.onhover-div").nth(2).click();
  await page.locator(".auth-modal").waitFor({ state: "visible", timeout: 8000 });
}

module.exports = { loginViaAPI, dismissNewsletterModal, openAuthModal, TEST_EMAIL, TEST_PASSWORD, BASE_API };
