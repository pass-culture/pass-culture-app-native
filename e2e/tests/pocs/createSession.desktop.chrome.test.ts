import { Builder, ThenableWebDriver } from 'selenium-webdriver'
import { ServiceBuilder, Options } from 'selenium-webdriver/chrome'

const { CHROME_DRIVER_PATH } = process.env

describe('desktop chrome', () => {
  let driver: ThenableWebDriver | undefined

  beforeAll(async () => {
    const service = new ServiceBuilder(CHROME_DRIVER_PATH)
    driver = new Builder().forBrowser('chrome')
      .setChromeService(service)
      .setChromeOptions(
        new Options()
          .addArguments([
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-using',
            '--disable-extensions',
            '--disable-gpu',
          ].join(' '))
          .headless()
      )
      .build()
    expect(driver).toBeDefined()
  })

  afterAll(async () => {
    await driver.quit()
  })

  it('should create session', async () => {
    await driver.get('https://passculture.app/accueil')
    const title = await driver.getTitle()
    await driver.manage().setTimeouts({ implicit: 30000 })
    expect(title).toEqual('Page d’accueil | pass Culture')
  })
})
