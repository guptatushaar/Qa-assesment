/* Minimal shared logger - keeps console output consistent across UI + API layers.
 * Swap for Winston/pino later if richer log files are needed for evaluators. */
const logger = {
  info: (msg) => console.log(`[INFO] ${new Date().toISOString()} ${msg}`),
  step: (msg) => console.log(`[STEP] ${msg}`),
  warn: (msg) => console.warn(`[WARN] ${msg}`),
  error: (msg) => console.error(`[ERROR] ${msg}`),
};

module.exports = logger;
