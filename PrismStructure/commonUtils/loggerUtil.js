/* Minimal shared logger — keeps console output consistent across UI + API layers. */
const logger = {
  step: (msg) => console.log(`[STEP] ${msg}`),
};

module.exports = logger;
