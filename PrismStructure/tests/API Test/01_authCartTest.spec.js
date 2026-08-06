const { test, expect } = require('@playwright/test');
const { AuthApi } = require('../../API/pageobjects/authApi');
const { CartApi } = require('../../API/pageobjects/cartApi');
const {
  generateUniqueUser,
  INVALID_PASSWORD,
  weakPasswordUser,
} = require('../../commonUtils/utils');
const { retryOnServerError } = require('../../commonUtils/testHelpers');

// API-AC1: register → login (token) → create cart → logout (token invalidation) (+ auth negatives).

test.describe('API-AC1 User Authentication & Cart Creation', () => {
  test('API-AC1-01/02/03: register, login, obtain token, create cart, logout invalidates token @smoke', async ({ request }) => {
    const authApi = new AuthApi(request);
    const cartApi = new CartApi(request);
    let user = generateUniqueUser();

    let registerRes = await retryOnServerError(() => authApi.register(user));
    if (registerRes.status() >= 500) {
      user = generateUniqueUser();
      registerRes = await retryOnServerError(() => authApi.register(user));
    }
    expect(registerRes.status(), 'registration should succeed').toBeLessThan(300);

    const loginRes = await retryOnServerError(() => authApi.login(user.email, user.password));
    expect(loginRes.status(), 'login should succeed').toBe(200);
    const loginBody = await loginRes.json();
    expect(loginBody).toHaveProperty('access_token');
    const token = loginBody.access_token;

    const cartRes = await retryOnServerError(() => cartApi.createCart(token));
    expect(cartRes.status(), 'cart creation should succeed').toBeLessThan(300);
    const cartBody = await cartRes.json();
    expect(cartBody.id).toBeTruthy();

    // Lifecycle close-out: GET /users/logout then protected /users/me must be unauthorized.
    const beforeLogout = await authApi.me(token);
    expect(beforeLogout.status(), 'token should work before logout').toBe(200);

    const logoutRes = await authApi.logout(token);
    expect(logoutRes.status(), 'logout should succeed').toBe(200);

    const afterLogout = await authApi.me(token);
    expect(afterLogout.status(), 'token must be invalid after logout').toBeGreaterThanOrEqual(401);
  });

  test('API-AC1-04: registering a duplicate email is rejected @regression', async ({ request }) => {
    const authApi = new AuthApi(request);
    const user = generateUniqueUser();

    const first = await retryOnServerError(() => authApi.register(user));
    expect(first.status()).toBeLessThan(300);

    const duplicate = await authApi.register(user);
    expect(duplicate.status(), 'duplicate email must not be accepted').toBeGreaterThanOrEqual(400);
  });

  test('API-AC1-05: login with wrong password is rejected @regression', async ({ request }) => {
    const authApi = new AuthApi(request);
    const user = generateUniqueUser();
    await retryOnServerError(() => authApi.register(user));

    const badLogin = await authApi.login(user.email, INVALID_PASSWORD);
    expect(badLogin.status(), 'wrong password must not return a token').toBeGreaterThanOrEqual(400);
  });

  test('API-AC1-06: register with weak password is rejected @regression', async ({ request }) => {
    const authApi = new AuthApi(request);
    const res = await authApi.register(weakPasswordUser());
    expect(res.status(), 'weak password must be rejected').toBeGreaterThanOrEqual(400);
  });
});
