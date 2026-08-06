/**
 * Optional mid-test screenshot helper for assessment evidence.
 * Attachments land under execution-reports/artifacts and are copied by collectEvidence.js.
 */
async function captureStep(page, testInfo, label) {
  const body = await page.screenshot({ fullPage: true });
  await testInfo.attach(label, { body, contentType: 'image/png' });
}

module.exports = { captureStep };
