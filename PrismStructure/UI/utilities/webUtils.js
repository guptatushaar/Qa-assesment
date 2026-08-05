/* Thin wrapper over common Playwright locator actions so page objects stay readable.
 * Auto-waiting is native to Playwright locators - this exists for consistency/logging,
 * not to reintroduce manual waits. */
const logger = require('../../commonUtils/loggerUtil');

class WebUtils {
  constructor(page) {
    this.page = page;
  }

  async goto(path) {
    logger.step(`Goto ${path}`);
    await this.page.goto(path);
  }

  async fill(locator, value, label) {
    logger.step(`Fill ${label ?? ''}`);
    await locator.fill(value);
  }

  async click(locator, label) {
    logger.step(`Click ${label ?? ''}`);
    await locator.click();
  }

  async waitForVisible(locator) {
    await locator.waitFor({ state: 'visible' });
  }
}

module.exports = { WebUtils };
