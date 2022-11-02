import { remote, RemoteOptions } from 'webdriverio'

const { IOS_ZIP_PATH, IOS_APP_NAME, IOS_DEVICE_NAME, IOS_PLATFORM_VERSION } = process.env

const capabilities = {
  platformName: 'iOS',
  'appium:app':
    IOS_ZIP_PATH || 'https://github.com/appium/appium/raw/1.x/sample-code/apps/TestApp.app.zip',
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
  const iosAppName = 'TestApp' || IOS_APP_NAME

  beforeAll(async () => {
    driver = await remote(wdOpts)
    expect(driver).toBeDefined()
  })

  afterEach(async () => {
    await driver.deleteSession()
  })

  it('should create session', async () => {
    const res = await driver.status()

    expect(res.build).toBeInstanceOf(Object)

    const element = await driver.findElement('class name', 'XCUIElementTypeApplication')
    const currentPackage = await driver.getElementAttribute(element.ELEMENT, 'name')
    expect(currentPackage).toEqual(iosAppName)
  })
})
