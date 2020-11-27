import { fillUrlEmail } from '../BusinessModule.utils'

describe('BusinessModule.utils', () => {
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
