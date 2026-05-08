/**
 * Shared login helper — sets the `uat` cookie directly via the API
 * so tests don't have to go through the UI each time.
 */

const BASE_API = process.env.API_URL || "http://localhost:5000";
const TEST_EMAIL = process.env.TEST_EMAIL || "consumer@xdope.com";
const TEST_PASSWORD = process.env.TEST_PASSWORD || "Consumer@123";

/**
 * Calls the login API directly and injects the `uat` cookie into the browser context.
 * Returns the full response data.
 */
async function loginViaAPI(page) {
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

  // Set cookie so every subsequent page load is authenticated
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

  // Also put account data in localStorage on the first navigation
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate((data) => {
    localStorage.setItem("account", JSON.stringify(data));
  }, body?.data || body);

  return body;
}

module.exports = { loginViaAPI, TEST_EMAIL, TEST_PASSWORD, BASE_API };
