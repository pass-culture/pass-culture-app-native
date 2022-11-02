import { remote, RemoteOptions } from 'webdriverio'

const { CHROME_DRIVER_PATH } = process.env

const capabilities = {
  platformName: 'Android',
  browserName: 'chrome',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'Android',
  'appium:chromedriverExecutable': CHROME_DRIVER_PATH,
}

const wdOpts: RemoteOptions = {
  port: 4723,
  logLevel: 'info',
  capabilities,
}

describe('android chrome', () => {
  let driver: WebdriverIO.Browser | undefined

  beforeAll(async () => {
    driver = await remote(wdOpts)
    expect(driver).toBeDefined()
  })

  afterAll(async () => {
    await driver.deleteSession()
  })

  it('should create session', async () => {
    await driver.url('https://www.google.com')

    const title = await driver.getTitle()
    expect(title).toEqual('Google')
  })
})
