import { remote, RemoteOptions } from 'webdriverio'

const { ANDROID_APK_PATH, ANDROID_APP_ID } = process.env

const capabilities = {
  platformName: 'Android',
  'appium:app':
    ANDROID_APK_PATH ||
    'https://github.com/appium/appium/raw/1.x/sample-code/apps/ApiDemos-debug.apk',
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
  const androidAppId = ANDROID_APP_ID || 'io.appium.android.apis'

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

    const currentPackage = await driver.getCurrentPackage()
    expect(currentPackage).toEqual(androidAppId)
  })
})
