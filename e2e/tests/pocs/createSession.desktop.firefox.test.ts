import { Builder, ThenableWebDriver } from 'selenium-webdriver'
import { Options } from 'selenium-webdriver/firefox'

describe('desktop firefox', () => {
  let driver: ThenableWebDriver | undefined

  beforeAll(async () => {
    driver = new Builder().forBrowser('firefox')
      .setFirefoxOptions(
        new Options()
          .headless()
      )
      .build()
    expect(driver).toBeDefined()
  })

  afterAll(async () => {
    await driver.quit()
  })

  it('should create session', async () => {
    await driver.get('https://google.com')
    const title = await driver.getTitle()
    expect(title).toEqual('Google')
  })
})
