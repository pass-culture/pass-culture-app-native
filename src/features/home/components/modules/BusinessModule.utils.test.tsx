import { getBusinessUrl, showBusinessModule } from './BusinessModule.utils'

describe('BusinessModule.utils', () => {
  describe('getBusinessUrl', () => {
    it.each`
      url                                                        | email                     | expected_result
      ${'https://url/?email={email}'}                            | ${'my.email@domain.ext'}  | ${'https://url/?email=my.email@domain.ext'}
      ${'https://url/?email={email}&otherOption=somethingElse'}  | ${'my.email2@domain.ext'} | ${'https://url/?email=my.email2@domain.ext&otherOption=somethingElse'}
      ${'https://app.passculture-testing.beta.gouv.fr/?{email}'} | ${'my.email3@domain.ext'} | ${'https://app.passculture-testing.beta.gouv.fr/?my.email3@domain.ext'}
      ${'https://url/#AZEJ?'}                                    | ${'my.email@domain.ext'}  | ${'https://url/#AZEJ?'}
      ${'https://url/#AZEJ?'}                                    | ${''}                     | ${'https://url/#AZEJ?'}
      ${''}                                                      | ${'my.email@domain.ext'}  | ${''}
    `(
      'should replace {email} by $email in $url when necessary',
      ({
        url,
        email,
        expected_result,
      }: {
        url: string
        email: string
        expected_result: string
      }) => {
        expect(getBusinessUrl(url, email)).toEqual(expected_result)
      }
    )
  })

  describe('showBusinessModule()', () => {
    it.each`
      targetNotConnectedUsersOnly | connected | showModule
      ${undefined}                | ${true}   | ${true}
      ${undefined}                | ${false}  | ${true}
      ${false}                    | ${true}   | ${true}
      ${false}                    | ${false}  | ${false}
      ${true}                     | ${true}   | ${false}
      ${true}                     | ${false}  | ${true}
    `(
      'showBusinessModule($targetNotConnectedUsersOnly, $connected) \t= $showModule',
      ({ targetNotConnectedUsersOnly, connected, showModule: expected }) => {
        const show = showBusinessModule(targetNotConnectedUsersOnly, connected)
        expect(show).toBe(expected)
      }
    )
  })
})
