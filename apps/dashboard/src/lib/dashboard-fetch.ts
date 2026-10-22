/**
 * Same-origin fetch that always sends the httpOnly session cookie.
 * (Default fetch uses `credentials: 'same-origin'`, which also sends cookies on same-origin
 * requests; `include` is explicit and matches cross-subdomain setups if you add them later.)
 */
export function dashboardFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  return fetch(input, { ...init, credentials: 'include' });
}
