// Renders resume-src/cv.html to public/docs/Aman_Javed_CV.pdf
// Usage: node resume-src/build-cv.mjs
import { chromium } from 'playwright'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const here = dirname(fileURLToPath(import.meta.url))
const src = resolve(here, 'cv.html')
const out = resolve(here, '../public/docs/Aman_Javed_CV.pdf')

const browser = await chromium.launch()
const page = await browser.newPage()
await page.goto('file://' + src, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(400)
await page.pdf({ path: out, format: 'Letter', printBackground: true, preferCSSPageSize: true })
await browser.close()
console.log('wrote', out)
