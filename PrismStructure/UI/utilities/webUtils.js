/* Thin goto wrapper with step logging for auth pages. */
const logger = require('../../commonUtils/loggerUtil');

class WebUtils {
  constructor(page) {
    this.page = page;
  }

  async goto(path) {
    logger.step(`Goto ${path}`);
    await this.page.goto(path);
  }
}

module.exports = { WebUtils };
