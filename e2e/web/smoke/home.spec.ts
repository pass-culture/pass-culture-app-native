import { expect, test } from '../fixtures'

test.describe('home', () => {
  test('displays the welcome screen', async ({ homePage }) => {
    await expect(homePage.welcomeHeading).toBeVisible()
    await expect(homePage.unlockCreditBanner).toBeVisible()
  })
})
