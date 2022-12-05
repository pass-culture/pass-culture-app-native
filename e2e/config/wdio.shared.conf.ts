import { mkdirSync } from 'fs'
import { resolve, join } from 'path'
// @ts-ignore no typing for this package so we ignore it for now
import slack from 'wdio-slack-service'
// @ts-ignore no typing for this package so we ignore it for now
import video from 'wdio-video-reporter'
import { env } from './environment/env'

const screenshotsPath = join(process.cwd(), 'e2e/output/screenshots')
const videosPath = join(process.cwd(), 'e2e/output/videos')

/**
 * All not needed configurations, for this boilerplate, are removed.
 * If you want to know which configuration options you have then you can
 * check https://webdriver.io/docs/configurationfile
 */
export const config: WebdriverIO.Config = {
  /** autoCompileOpts are currently injected through a patch-package =*/
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      transpileOnly: true,
      project: resolve(__dirname, '..', 'tsconfig.json'),
    },
  },
  //
  // ====================
  // Runner Configuration
  // ====================
  // WebdriverIO allows it to run your tests in arbitrary locations (e.g. locally or
  // on a remote machine).
  runner: 'local',
  //
  // ==================
  // Specify Test Files
  // ==================
  // The test-files are specified in:
  // - wdio.android.browser.conf.ts
  // - wdio.android.app.conf.ts
  // - wdio.ios.browser.conf.ts
  // - wdio.ios.app.conf.ts
  //
  /**
   * NOTE: This is just a place holder and will be overwritten by each specific configuration
   */
  specs: [],
  //
  // ============
  // Capabilities
  // ============
  // The capabilities are specified in:
  // - wdio.android.browser.conf.ts
  // - wdio.android.app.conf.ts
  // - wdio.ios.browser.conf.ts
  // - wdio.ios.app.conf.ts
  //
  /**
   * NOTE: This is just a place holder and will be overwritten by each specific configuration
   */
  capabilities: [],
  //
  // ===================
  // Test Configurations
  // ===================
  // Define all options that are relevant for the WebdriverIO instance here
  //
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  logLevel: 'debug',
  // Set specific log levels per logger
  // loggers:
  // - webdriver, webdriverio
  // - @wdio/applitools-service, @wdio/browserstack-service, @wdio/devtools-service, @wdio/sauce-service
  // - @wdio/mocha-framework, @wdio/jasmine-framework
  // - @wdio/local-runner
  // - @wdio/sumologic-reporter
  // - @wdio/cli, @wdio/config, @wdio/utils
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  // logLevels: {
  //     webdriver: 'info',
  //     '@wdio/applitools-service': 'info'
  // },
  //
  // If you only want to run your tests until a specific amount of tests have failed use
  // bail (default is 0 - don't bail, run all tests).
  bail: 0,
  // Set a base URL in order to shorten url command calls. If your `url` parameter starts
  // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
  // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
  // gets prepended directly.
  baseUrl: env.WDIO_BASE_URL,
  // Default timeout for all waitFor* commands.
  /**
   * NOTE: This has been increased for more stable Appium Native app
   * tests because they can take a bit longer.
   */
  waitforTimeout: 60000,
  // Default timeout in milliseconds for request
  // if browser driver or grid doesn't send response
  connectionRetryTimeout: 960000,
  // Default request retries count
  connectionRetryCount: 3,
  // Test runner services
  // Services take over a specific job you don't want to take care of. They enhance
  // your test setup with almost no effort. Unlike plugins, they don't add new
  // commands. Instead, they hook themselves up into the test process.
  //
  // Services are empty here but will be defined in the
  // - wdio.shared.browserstack.conf.ts
  // - wdio.shared.local.appium.conf.ts
  // - wdio.shared.sauce.conf.ts
  // configuration files
  services: [
    process.env.SLACK_WEB_HOOK_URL && [
      slack,
      {
        webHookUrl: process.env.SLACK_WEB_HOOK_URL,
        notifyOnlyOnFailure: true,
        messageTitle: `[${process.env.ENVIRONMENT}] Webdriverio Slack Reporter ${
          process.env.GITHUB_SHA_SHORT ? `(${process.env.GITHUB_SHA_SHORT})` : ''
        }${process.env.GITHUB_REF_SLUG ? ` (${process.env.GITHUB_REF_SLUG})` : ''}`,
      },
    ],
  ].filter(Boolean) as any,
  // Framework you want to run your specs with.
  // The following are supported: Mocha, Jasmine, and Cucumber
  // see also: https://webdriver.io/docs/frameworks
  //
  // Make sure you have the wdio adapter package for the specific framework installed
  // before running any tests.
  framework: 'mocha',
  // The number of times to retry the entire specfile when it fails as a whole
  // specFileRetries: 1,
  //
  // Delay in seconds between the spec file retry attempts
  // specFileRetriesDelay: 0,
  //
  // Whether or not retried specfiles should be retried immediately or deferred to the end of the queue
  // specFileRetriesDeferred: false,
  //
  // Test reporter for stdout.
  // The only one supported by default is 'dot'
  // see also: https://webdriver.io/docs/dot-reporter
  reporters: [
    'spec',
    [
      video,
      {
        saveAllVideos: false, // If true, also saves videos for successful test cases
        videoSlowdownMultiplier: 4, // Higher to get slower videos, lower for faster videos [Value 1-100]
        outputDir: videosPath,
      },
    ],
  ],
  // Options to be passed to Mocha.
  mochaOpts: {
    ui: 'bdd',
    /**
     * NOTE: This has been increased for more stable Appium Native app
     * tests because they can take a bit longer.
     */
    timeout: 5 * 60 * 1000, // 5min
  },
  //
  // =====
  // Hooks
  // =====
  // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
  // it and to build services around it. You can either apply a single function or an array of
  // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
  // resolved to continue.
  //
  /**
   * NOTE: No Hooks are used in this project, but feel free to add them if you need them.
   */
  onPrepare: async function () {
    mkdirSync(screenshotsPath, { recursive: true })
    mkdirSync(videosPath, { recursive: true })
  },
  afterTest: async function (test, context, { passed }) {
    console.log(`~~~~~~~~~~~~~~~~~~~~~~ [passed=${passed}] ~~~~~~~~~~~~~~~`)
    if (!passed) {
      await browser.takeScreenshot()
      const timestamp = new Date()
        .toISOString()
        .replace(/[^0-9]/g, '')
        .slice(0, -5)
      const filePath = `${screenshotsPath}/${timestamp}_${test.parent}_${test.title.replace(
        / /g,
        '-'
      )}.png`
      await browser.saveScreenshot(filePath)
      console.log(`~~~~~~~~~~~~~~~~~~~~~~ [screenshot location=${filePath}] ~~~~~~~~~~~~~~~`)
    }
  },
}
