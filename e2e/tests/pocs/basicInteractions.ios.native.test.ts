import { remote, RemoteOptions } from 'webdriverio'

const { IOS_ZIP_PATH, IOS_DEVICE_NAME, IOS_PLATFORM_VERSION } = process.env

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
}

describe('ios', () => {
  let driver: WebdriverIO.Browser | undefined

  beforeAll(async () => {
    driver = await remote(wdOpts)
    expect(driver).toBeDefined()
  })

  afterEach(async () => {
    await driver.deleteSession()
  })

  it('should type "Hello World!" and retrieve value in input', async () => {
    const elementId = await driver.findElement('accessibility id', 'IntegerA')
    driver.elementSendKeys(elementId.ELEMENT, 'Hello World!')

    const elementValue = await driver.findElement('accessibility id', 'IntegerA')
    const attr = await driver.getElementAttribute(elementValue.ELEMENT, 'value')
    expect(attr).toEqual('Hello World!')
  })

  it('should click on "show alert" and read alert text', async () => {
    const element = await driver.findElement('accessibility id', 'show alert')
    await driver.elementClick(element.ELEMENT)
    const alertText = await driver.getAlertText()
    expect(alertText).toEqual(`Cool title this alert is so cool.`)
  })
})
