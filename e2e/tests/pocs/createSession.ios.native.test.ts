import { remote, RemoteOptions } from 'webdriverio'

const { IOS_ZIP_PATH, IOS_APP_ID, IOS_DEVICE_NAME, IOS_PLATFORM_VERSION } = process.env

const capabilities = {
  platformName: 'iOS',
  'appium:app': IOS_ZIP_PATH,
  'appium:automationName': 'XCUITest',
  'appium:deviceName': IOS_DEVICE_NAME || 'iPhone 12',
  'appium:platformVersion': IOS_PLATFORM_VERSION || '15.5',
}

const wdOpts: RemoteOptions = {
  port: 4723,
  logLevel: 'info',
  capabilities,
  coloredLogs: true,
  waitforTimeout: 10000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
}

describe('ios', () => {
  let driver: WebdriverIO.Browser | undefined

  beforeAll(async () => {
    driver = await remote(wdOpts)
    expect(driver).toBeDefined()
  })

  afterAll(async () => {
    await driver.deleteSession()
  })

  it('should create session', async () => {
    const res = await driver.status()

    expect(res.build).toBeInstanceOf(Object)

    const isAppInstalled = driver.isAppInstalled(IOS_APP_ID)
    expect(isAppInstalled).toBeTruthy()
  })
})
