import { Builder } from 'selenium-webdriver'
import { ServiceBuilder } from 'selenium-webdriver/chrome'

const { CHROME_DRIVER_PATH } = process.env

describe('desktop chrome', () => {
  let driver

  beforeAll(async () => {
    const service = new ServiceBuilder(CHROME_DRIVER_PATH)
    driver = new Builder().forBrowser('chrome').setChromeService(service).build()
    expect(driver).toBeDefined()
  })

  afterEach(async () => {
    await driver.quit()
  })

  it('should create session', async () => {
    await driver.get('https://passculture.app/accueil')
    const title = await driver.getTitle()

    expect(title).toEqual('Page d’accueil | pass Culture')
  })
})
