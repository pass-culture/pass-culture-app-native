import { remote, RemoteOptions } from 'webdriverio'

const { ANDROID_APK_PATH, ANDROID_APP_ID } = process.env

const capabilities = {
  platformName: 'Android',
  'appium:app': ANDROID_APK_PATH,
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'Android',
}

const wdOpts: RemoteOptions = {
  port: 4723,
  logLevel: 'info',
  capabilities,
}

describe('android', () => {
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

    const currentPackage = await driver.getCurrentPackage()
    expect(currentPackage).toEqual(ANDROID_APP_ID)
  })
})
