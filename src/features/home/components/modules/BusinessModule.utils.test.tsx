import { fillUrlEmail, shouldUrlBeFilled, showBusinessModule } from './BusinessModule.utils'

describe('BusinessModule.utils', () => {
  describe('shouldUrlBeFilled', () => {
    it.each`
      url                                                        | shouldBeFilled
      ${'https://url/?email={email}'}                            | ${true}
      ${'https://url/?email={email}&flavor=chocolate'}           | ${true}
      ${'https://app.passculture-testing.beta.gouv.fr/?{email}'} | ${true}
      ${'https://url/?email=email'}                              | ${false}
      ${'https://url/?{password}={passwordemail}'}               | ${false}
      ${''}                                                      | ${false}
    `(
      'should return $shouldBeFilled when url is $url',
      ({ url, shouldBeFilled }: { url: string; shouldBeFilled: boolean }) => {
        expect(shouldUrlBeFilled(url)).toBe(shouldBeFilled)
      }
    )
  })

  describe('fillEmail', () => {
    it.each`
      url                                                        | email                     | expected_result
      ${'https://url/?email={email}'}                            | ${'my.email@domain.ext'}  | ${'https://url/?email=my.email@domain.ext'}
      ${'https://url/?email={email}&otherOption=somethingElse'}  | ${'my.email2@domain.ext'} | ${'https://url/?email=my.email2@domain.ext&otherOption=somethingElse'}
      ${'https://app.passculture-testing.beta.gouv.fr/?{email}'} | ${'my.email3@domain.ext'} | ${'https://app.passculture-testing.beta.gouv.fr/?my.email3@domain.ext'}
      ${'https://url/#AZEJ?'}                                    | ${'my.email@domain.ext'}  | ${'https://url/#AZEJ?'}
      ${''}                                                      | ${'my.email@domain.ext'}  | ${''}
    `(
      'should replace {email} by $email in $url',
      ({
        url,
        email,
        expected_result,
      }: {
        url: string
        email: string
        expected_result: string
      }) => {
        expect(fillUrlEmail(url, email)).toEqual(expected_result)
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
