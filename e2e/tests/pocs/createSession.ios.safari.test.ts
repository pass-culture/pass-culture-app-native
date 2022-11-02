import { remote, RemoteOptions } from 'webdriverio'

const { IOS_DEVICE_NAME, IOS_PLATFORM_VERSION } = process.env

const capabilities = {
  platformName: 'iOS',
  browserName: 'safari',
  'appium:automationName': 'XCUITest',
  'appium:deviceName': IOS_DEVICE_NAME || 'iPhone 12',
  'appium:platformVersion': IOS_PLATFORM_VERSION || '15.5',
}

const wdOpts: RemoteOptions = {
  port: 4723,
  logLevel: 'info',
  capabilities,
}

describe('iOS Safari', () => {
  let driver: WebdriverIO.Browser | undefined

  beforeAll(async () => {
    driver = await remote(wdOpts)
    expect(driver).toBeDefined()
  })

  afterAll(async () => {
    await driver.deleteSession()
  })

  it('should create session', async () => {
    await driver.url('https://www.google.fr')

    const title = await driver.getTitle()
    expect(title).toEqual('Google')
  })
})
