const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");

(async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  const base = "http://127.0.0.1:3000";
  await page.goto(base, { waitUntil: "networkidle", timeout: 120000 });
  await page.evaluate(() => document.fonts.ready);
  const dest = path.join(process.cwd(), "docs", "screenshots");
  fs.mkdirSync(dest, { recursive: true });
  await page.screenshot({ path: path.join(dest, "hero.png") });
  await page.locator("#coffee").screenshot({ path: path.join(dest, "catalog.png") });
  await page.locator("#request").screenshot({ path: path.join(dest, "form.png") });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base, { waitUntil: "networkidle", timeout: 120000 });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(dest, "mobile.png"), fullPage: true });
  await browser.close();
  console.log("Created real browser screenshots:", fs.readdirSync(dest).join(", "));
})().catch(err => { console.error(err); process.exit(1); });
