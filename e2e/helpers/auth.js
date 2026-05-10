/**
 * Shared auth helpers for e2e tests.
 */

const BASE_API = process.env.API_URL || "http://localhost:5000";
const TEST_EMAIL = process.env.TEST_EMAIL || "consumer@xdope.com";
const TEST_PASSWORD = process.env.TEST_PASSWORD || "Consumer@123";
const TEST_NAME = "Test Consumer";

/**
 * Sets the `newsletter` cookie so the modal never appears during tests.
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
 * Ensures the test user exists. Tries to login; if 401 registers first then logs in.
 * Returns the token string.
 */
async function ensureTestUser(page) {
  const loginRes = await page.request.post(`${BASE_API}/login`, {
    data: { email: TEST_EMAIL, password: TEST_PASSWORD },
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  });

  if (loginRes.ok()) {
    const body = await loginRes.json();
    return { token: body?.access_token || body?.token, body };
  }

  // User doesn't exist — register then login
  await page.request.post(`${BASE_API}/register`, {
    data: {
      name: TEST_NAME,
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      password_confirmation: TEST_PASSWORD,
    },
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  });

  const loginRes2 = await page.request.post(`${BASE_API}/login`, {
    data: { email: TEST_EMAIL, password: TEST_PASSWORD },
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  });

  if (!loginRes2.ok()) {
    throw new Error(`Login failed after registration: ${loginRes2.status()} ${await loginRes2.text()}`);
  }

  const body = await loginRes2.json();
  return { token: body?.access_token || body?.token, body };
}

/**
 * Logs in via API and injects `uat` cookie. Also suppresses newsletter modal.
 */
async function loginViaAPI(page) {
  await dismissNewsletterModal(page);

  const { token, body } = await ensureTestUser(page);
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

  // goto can abort if previous test triggered navigation; retry once
  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
  } catch {
    await page.waitForTimeout(500);
    await page.goto("/", { waitUntil: "domcontentloaded" });
  }
  await page.evaluate((data) => {
    localStorage.setItem("account", JSON.stringify(data));
  }, body?.data || body);

  return body;
}

/**
 * Opens the auth modal via the user icon (3rd li.onhover-div in .icon-nav).
 */
async function openAuthModal(page) {
  await page.locator(".icon-nav li.onhover-div").nth(2).click();
  await page.locator(".auth-modal").waitFor({ state: "visible", timeout: 8000 });
}

module.exports = { loginViaAPI, dismissNewsletterModal, openAuthModal, ensureTestUser, TEST_EMAIL, TEST_PASSWORD, BASE_API };
