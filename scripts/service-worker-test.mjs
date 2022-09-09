/* eslint-disable no-console */
import { readFileSync, writeFileSync } from 'fs'
import { performance } from 'perf_hooks'

import { execa, execaSync } from 'execa'
import puppeteer from 'puppeteer'

const versionFrom = process.argv[2]
const versionTo = process.argv[3]

const VERBOSE = Boolean(process.env.VERBOSE) || false
const TEST = Boolean(process.env.TEST) || false
const PORT = Number(process.env.PORT) || 3000
const APP_PUBLIC_URL = `http://localhost:${PORT}`

function runServe() {
  try {
    console.log(`Run serve on port ${PORT}`)
    const subprocess = execa('serve', ['-s', 'build', '-p', String(PORT)], {
      detached: true,
      preferLocal: true,
    })
    subprocess.stdout.pipe(process.stdout)
    return subprocess
  } catch (error) {
    console.error(error)
  }
}

async function buildWebapp(version) {
  try {
    const startTime = performance.now()

    const initialVersion = await checkoutVersion(version)

    console.log(`Building Web application ${version}${TEST ? ' (TEST)' : ''}`)
    const subprocess = await execaSync('yarn', ['build:testing'], {
      env: {
        APP_PUBLIC_URL,
        NODE_OPTIONS: '--openssl-legacy-provider --max-old-space-size=4096',
      },
    })
    console.log(subprocess.stdout)
    if (subprocess.stderr) {
      console.log('ERROR', subprocess.stderr)
    }

    if (TEST && initialVersion) {
      const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
      writeFileSync(
        'package.json',
        `${JSON.stringify({ ...pkg, version: initialVersion }, null, 2)}\n`,
        'utf8'
      )
    }
    const endTime = performance.now()
    console.log(`App build in ${(endTime - startTime) / 1000} seconds`)
  } catch (error) {
    console.error(error)
  }
}

async function checkoutVersion(version) {
  if (!TEST) {
    try {
      console.log(`Checking out version ${version}`)
      const subprocessFetchTags = await execaSync('git', ['fetch', '--tags'])
      console.log(subprocessFetchTags.stdout)
      if (subprocessFetchTags.stderr) {
        console.log('ERROR', subprocessFetchTags.stderr)
      }
      const subprocess = await execaSync('git', ['checkout', version])
      console.log(subprocess.stdout)
      if (subprocess.stderr) {
        console.log('ERROR', subprocess.stderr)
      }
    } catch (error) {
      console.error(error)
    }
  } else {
    try {
      const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
      const initialVersion = pkg.version
      writeFileSync(
        'package.json',
        `${JSON.stringify({ ...pkg, version: version.replace(/^.*v/, '') }, null, 2)}\n`,
        'utf8'
      )
      return initialVersion
    } catch (error) {
      console.error(error)
    }
  }
}

function evaluateMetaContentVersion() {
  return document.querySelector('meta[name="version"]').getAttribute('content')
}

async function waitFor(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function serializeConsoleMessage(msg) {
  // serialize my args the way I want
  const args = await Promise.all(
    msg.args().map((arg) =>
      arg.executionContext()?.evaluate((arg) => {
        // I'm in a page context now. If my arg is an error - get me its message.
        if (arg instanceof Error) {
          return arg.message
        }
        // return arg right away. since we use `executionContext.evaluate`, it'll return JSON value of
        // the argument if possible, or `undefined` if it fails to stringify it.
        return arg
      }, arg)
    )
  )
  args.map((arg) => {
    if (arg !== null) {
      console.log(arg)
    }
  })
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
  let serveSubprocess
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

    await buildWebapp(versionFrom)
    serveSubprocess = runServe()

    console.log(`Launching puppeteer at ${APP_PUBLIC_URL}`)
    browser = await puppeteer.launch({
      args: ['--disable-setuid-sandbox', '--no-sandbox', '--enable-features=NetworkService'],
      headless: false,
      ignoreHTTPSErrors: true,
    })
    const page = await browser.newPage()

    if (VERBOSE) {
      // Only useful for debugging purposes
      page.on('console', serializeConsoleMessage)
      page.on('request', (httpRequest) => {
        console.log(httpRequest.url())
      })
    }

    await page.goto(APP_PUBLIC_URL, { waitUntil: 'networkidle0', timeout: 0 })
    await waitForServiceWorkers(page)

    let version = await page.evaluate(evaluateMetaContentVersion)
    console.log(`meta version: v${version} - versionFrom: ${versionFrom}`)

    if (!versionFrom.includes(version)) {
      throw new Error(
        `Version from v${version} differ from build version ${versionFrom}, aborting...`
      )
    }

    await buildWebapp(versionTo)

    console.log('It will now reload the page')
    await page.reload({ waitUntil: 'networkidle0', timeout: 0 })

    await waitForServiceWorkers(page)
    await page.evaluate(() => {
      const btn = document.querySelector('button[type="button"]')
      btn?.click()
    })
    await waitFor(15000)
    version = await page.evaluate(evaluateMetaContentVersion)
    console.log(`meta version: v${version} - versionTo: ${versionTo}`)

    if (!versionTo.includes(version)) {
      throw new Error(`Version to v${version} differ from build version ${versionTo}, aborting...`)
    }

    // Only useful for debugging purpose
    // await page.screenshot({ path: 'puppeteer-sw-test.png' })

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

    try {
      serveSubprocess.kill()
      await serveSubprocess
      console.log('Kill serve ✅')
    } catch (err) {
      if (err.killed) {
        console.log('Kill serve ✅')
      } else {
        console.log('Failed to kill serve, retrying...')
        console.error(err)
        try {
          serveSubprocess.kill()
          await serveSubprocess
          console.log('Kill serve ✅')
        } catch (err2) {
          if (err2.killed) {
            console.log('Kill serve ✅')
          } else {
            console.log('Failed to kill serve after two attempt ❌')
            console.error(err2)
          }
        }
      }
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
