import Cookies from "js-cookie";

const getBaseURL = () => process.env.API_PROD_URL || "http://localhost:5000";

const getToken = () => {
  if (typeof document === "undefined") return "";
  try { return Cookies.get("uat") || ""; } catch { return ""; }
};

const request = async ({ url, method = "get", data, params, responseType, headers: extraHeaders } = {}) => {
  try {
    const base = getBaseURL();
    let fullUrl = url?.startsWith("http") ? url : `${base}${url}`;

    // Append query params
    if (params && Object.keys(params).length > 0) {
      const qs = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
      ).toString();
      if (qs) fullUrl += (fullUrl.includes("?") ? "&" : "?") + qs;
    }

    const token = getToken();
    const fetchOpts = {
      method: method.toUpperCase(),
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...extraHeaders,
      },
    };

    if (data) {
      if (data instanceof FormData) {
        fetchOpts.body = data;
      } else {
        fetchOpts.headers["Content-Type"] = "application/json";
        fetchOpts.body = JSON.stringify(data);
      }
    }

    const res = await fetch(fullUrl, fetchOpts);
    const contentType = res.headers.get("content-type") || "";
    const responseData = contentType.includes("application/json") ? await res.json() : await res.text();

    // Mimic axios response shape: { data, status, ... }
    return { data: responseData, status: res.status, ok: res.ok };
  } catch (error) {
    // Return error in axios-compatible shape so callers using res?.data don't crash
    return { data: null, status: 0, ok: false, error };
  }
};

export default request;
