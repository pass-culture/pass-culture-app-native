import { expect, test } from '../../fixtures'

test.describe('signup', { tag: '@smoke' }, () => {
  test('a new user can create an account', async ({ signupPage }) => {
    const email = `e2e-web-signup-${Date.now()}@passculture-testing.app`

    await signupPage.goto()
    await signupPage.signUp(email, process.env.E2E_USER_PASSWORD ?? '')

    await expect(signupPage.confirmationEmailHeading).toBeVisible()
  })
})
