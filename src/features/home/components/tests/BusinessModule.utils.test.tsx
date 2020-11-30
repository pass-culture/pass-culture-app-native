import { fillUrlEmail, shouldUrlBeFilled } from '../BusinessModule.utils'

describe('BusinessModule.utils', () => {
  describe('shouldUrlBeFilled', () => {
    it.each`
      url                                                 | shouldBeFilled
      ${'https://url/?email={email}'}                     | ${true}
      ${'https://url/?email={email}&flavor=chocolate'}    | ${true}
      ${'passculture://app.passculture.testing/?{email}'} | ${true}
      ${'https://url/?email=email'}                       | ${false}
      ${'https://url/?{password}={passwordemail}'}        | ${false}
      ${''}                                               | ${false}
    `(
      'should return $shouldBeFilled when url is $url',
      ({ url, shouldBeFilled }: { url: string; shouldBeFilled: boolean }) => {
        expect(shouldUrlBeFilled(url)).toBe(shouldBeFilled)
      }
    )
  })
  describe('fillEmail', () => {
    it.each`
      url                                                      | email                     | expected_result
      ${'http://url/?email={email}'}                           | ${'my.email@domain.ext'}  | ${'http://url/?email=my.email@domain.ext'}
      ${'http://url/?email={email}&otherOption=somethingElse'} | ${'my.email2@domain.ext'} | ${'http://url/?email=my.email2@domain.ext&otherOption=somethingElse'}
      ${'passculture://app.passculture.testing/?{email}'}      | ${'my.email3@domain.ext'} | ${'passculture://app.passculture.testing/?my.email3@domain.ext'}
      ${'http://url/#AZEJ?'}                                   | ${'my.email@domain.ext'}  | ${'http://url/#AZEJ?'}
      ${''}                                                    | ${'my.email@domain.ext'}  | ${''}
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
})
