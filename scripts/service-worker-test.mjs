/* eslint-disable no-console */
import { cpSync } from 'fs'
import { join } from 'path'

// We do not want to install puppeteer on the whole project
// as the JS dependencies caused build issues after building with the CI
// https://github.com/pass-culture/pass-culture-app-native/pull/3528
// eslint-disable-next-line import/no-unresolved
import puppeteer from 'puppeteer'

const versionFrom = process.argv[2]
const versionTo = process.argv[3]

const PORT = Number(process.env.PORT) || 3000
const APP_PUBLIC_URL = `http://localhost:${PORT}/index.html`

function evaluateMetaContentVersion() {
  return document.querySelector('meta[name="version"]').getAttribute('content')
}

async function waitFor(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function waitForServiceWorkers(page) {
  return page.evaluate(() =>
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      return Promise.all(
        registrations.map(
          (reg) =>
            new Promise((resolve) => {
              if (reg.active) {
                resolve()
              } else {
                reg.onupdatefound = () => {
                  setTimeout(resolve, 10)
                }
              }
            })
        )
      )
    })
  )
}

;(async () => {
  let browser
  let success = false
  try {
    if (!versionFrom || !versionTo) {
      throw new Error(
        `You must set two versions to run the test, ex: yarn test:sw v1.200.3 v1.201.1`
      )
    }
    console.log('Running service-worker test:', {
      versionFrom,
      versionTo,
    })

    console.log(`Launching puppeteer at ${APP_PUBLIC_URL}`)
    browser = await puppeteer.launch({
      args: ['--disable-setuid-sandbox', '--no-sandbox', '--enable-features=NetworkService'],
      executablePath: 'google-chrome-stable',
      headless: false,
      ignoreHTTPSErrors: true,
      env: {
        DISPLAY: ':99.0',
      },
    })
    const page = await browser.newPage()

    await page.goto(APP_PUBLIC_URL, { waitUntil: 'networkidle0', timeout: 0 })
    await waitForServiceWorkers(page)

    let version = await page.evaluate(evaluateMetaContentVersion)
    console.log(`meta version is v${version} while it should be ${versionFrom}`)

    if (!versionFrom.includes(version)) {
      throw new Error(`Version v${version} differ from build version ${versionFrom}, aborting...`)
    }

    cpSync(join(process.cwd(), 'versionTo/build'), join(process.cwd(), 'build'), {
      recursive: true,
    })

    console.log('It will now reload the page')
    await page.reload({ waitUntil: 'networkidle0', timeout: 0 })

    await waitForServiceWorkers(page)
    await page.evaluate(() => {
      const btn = document.querySelector('button[type="button"]')
      btn?.click()
    })

    await waitFor(15000)
    version = await page.evaluate(evaluateMetaContentVersion)
    console.log(`meta version is v${version} while it should be ${versionTo}`)

    if (!versionTo.includes(version)) {
      throw new Error(`Version v${version} differ from build version ${versionTo}, aborting...`)
    }

    success = true
  } catch (error) {
    console.error(error)
  } finally {
    try {
      await browser.close()
      console.log('Closed puppeteer ✅')
    } catch (err) {
      console.log('Failed to close puppeteer ❌')
      console.error(err)
    }

    if (success) {
      console.log('Service worker update test ✅')
      process.exit(0)
    } else {
      console.log('Service worker update test ❌')
      process.exit(1)
    }
  }
})()
