import { expect, test } from '../../fixtures'

test.describe('login', { tag: '@smoke' }, () => {
  test('a beneficiary user can log in with their email and password', async ({
    loginPage,
    beneficiaryUser,
  }) => {
    await loginPage.goto()
    await loginPage.login(beneficiaryUser.email, process.env.E2E_USER_PASSWORD ?? '')

    await expect(loginPage.emailInput).toBeHidden()
  })
})