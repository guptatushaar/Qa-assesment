/**
 * Shared helpers for live demo API flakiness and UI country labels.
 */

/**
 * Retries an API action on transient 5xx without masking 4xx contract failures.
 * @param {() => Promise<import('@playwright/test').APIResponse>} action
 */
async function retryOnServerError(action, attempts = 3) {
  let response;
  for (let i = 0; i < attempts; i += 1) {
    response = await action();
    if (response.status() < 500) return response;
    await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
  }
  return response;
}

/** Maps short country names to the exact option label in Toolshop dropdowns. */
function countryOptionLabel(country) {
  if (!country) return 'Netherlands (the)';
  if (/netherlands/i.test(country)) return 'Netherlands (the)';
  return country;
}

module.exports = { retryOnServerError, countryOptionLabel };
