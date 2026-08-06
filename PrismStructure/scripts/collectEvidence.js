/**
 * Collect Playwright screenshots into a stable, reviewable evidence folder.
 * Run after `playwright test` (wired via npm scripts).
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname.replace(/[/\\]scripts$/, '');
const ARTIFACTS = path.join(ROOT, 'execution-reports', 'artifacts');
const SCREENSHOTS = path.join(ROOT, 'execution-reports', 'screenshots');
const INDEX = path.join(SCREENSHOTS, 'INDEX.md');

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, acc);
    else if (/\.(png|jpg|jpeg|webp)$/i.test(name)) acc.push(full);
  }
  return acc;
}

function slugFromArtifactPath(filePath) {
  // .../artifacts/<test-folder>/test-finished-1.png → test-folder name
  const parts = filePath.split(path.sep);
  const artifactsIdx = parts.lastIndexOf('artifacts');
  const folder = artifactsIdx >= 0 ? parts[artifactsIdx + 1] : path.basename(path.dirname(filePath));
  const base = path.basename(filePath, path.extname(filePath));
  const safe = String(folder)
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120);
  return `${safe}__${base}${path.extname(filePath)}`;
}

function main() {
  fs.mkdirSync(SCREENSHOTS, { recursive: true });
  // Clear previous collected screenshots (keep folder).
  for (const name of fs.readdirSync(SCREENSHOTS)) {
    if (name === 'INDEX.md') continue;
    fs.unlinkSync(path.join(SCREENSHOTS, name));
  }

  const files = walk(ARTIFACTS);
  const rows = [];

  files.forEach((src, i) => {
    const destName = `${String(i + 1).padStart(2, '0')}_${slugFromArtifactPath(src)}`;
    const dest = path.join(SCREENSHOTS, destName);
    fs.copyFileSync(src, dest);
    rows.push({ n: i + 1, file: destName, from: path.relative(ROOT, src) });
  });

  const md = [
    '# UI execution screenshots',
    '',
    `Collected: **${new Date().toISOString()}**`,
    `Count: **${rows.length}**`,
    '',
    'Source: Playwright `screenshot: on` artifacts under `execution-reports/artifacts/`, copied here for assessment review.',
    '',
    '| # | File | Source artifact |',
    '|---|------|-----------------|',
    ...rows.map((r) => `| ${r.n} | \`${r.file}\` | \`${r.from}\` |`),
    '',
    'Open the HTML report for embedded evidence + API run details:',
    '',
    '```bash',
    'npm run report',
    '```',
    '',
  ].join('\n');

  fs.writeFileSync(INDEX, md, 'utf8');
  console.log(`[evidence] Collected ${rows.length} screenshot(s) → execution-reports/screenshots/`);
  if (!rows.length) {
    console.warn('[evidence] No screenshots found. UI tests may not have run, or screenshot capture is off.');
  }
}

main();
