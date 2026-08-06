const path = require('path');

/**
 * Shared test-data helpers for UI + API.
 * Purpose: one place for identity, negative credentials, and invoice billing so
 * specs do not drift (hardcoded copies caused Canada/UttarP/2134AB mismatches).
 */

/** Email local-part used for unique Gmail +tag addresses. */
const EMAIL_LOCAL = 'tushaarguptatest';

/** Strong password that satisfies API rules (upper, lower, digit, symbol). */
const VALID_PASSWORD = 'Valid#12345';

/** Intentionally wrong password for negative login tests. */
const INVALID_PASSWORD = 'WrongPassword#1';

/** Intentionally weak password for negative register tests. */
const WEAK_PASSWORD = 'weak';

/**
 * Guide invoice fixture (API/testdata/invoicePayload.json).
 * billing_country TG + Florida + 1234AA is accepted by POST /invoices;
 * arbitrary state/postal (e.g. UttarP / 2134AB) returns 422.
 */
const invoiceFixture = require(path.join(__dirname, '../API/testdata/invoicePayload.json'));

/**
 * Builds a fresh registrant for each test run.
 * Email stamp avoids "already exists"; NL + Dutch postal enables UI autofill/checkout.
 */
function generateUniqueUser() {
  const stamp = `${Date.now()}${Math.floor(Math.random() * 10000)}`;
  return {
    first_name: 'Tushaar',
    last_name: 'Gupta',
    email: `${EMAIL_LOCAL}+${stamp}@gmail.com`,
    password: VALID_PASSWORD,
    dob: '1997-12-08',
    phone: '5231193385',
    address: {
      street: 'Test Street 1',
      house_number: '55',
      city: 'Test City',
      state: 'Test State',
      // Netherlands + 1432AA: Dutch postal format; Canada rejects this postal and blocks CoD.
      country: 'Netherlands',
      postal_code: '1432AA',
    },
  };
}

/**
 * UI checkout billing fields — derived from the same user profile the SUT pre-fills.
 * Optional streetOverride keeps the preferred billing street without duplicating the object.
 */
function uiBillingAddress(user = generateUniqueUser(), streetOverride = invoiceFixture.billing_street) {
  return {
    street: streetOverride,
    house_number: user.address.house_number,
    city: user.address.city,
    state: user.address.state,
    country: user.address.country,
    postal_code: user.address.postal_code,
  };
}

/**
 * API invoice body: clone fixture and inject runtime cart_id.
 * Keeps JSON as the single source of truth for billing fields.
 */
function validInvoicePayload(cartId) {
  const { _comment, ...billing } = invoiceFixture;
  return {
    ...billing,
    cart_id: cartId,
  };
}

/** User clone with a password the API must reject. */
function weakPasswordUser() {
  return { ...generateUniqueUser(), password: WEAK_PASSWORD };
}

module.exports = {
  EMAIL_LOCAL,
  VALID_PASSWORD,
  INVALID_PASSWORD,
  WEAK_PASSWORD,
  generateUniqueUser,
  uiBillingAddress,
  validInvoicePayload,
  weakPasswordUser,
};
