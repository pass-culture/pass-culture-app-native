import { getBusinessUrl } from 'features/home/components/modules/business/helpers/getBusinessUrl'

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
    ({ url, email, expected_result }: { url: string; email: string; expected_result: string }) => {
      expect(getBusinessUrl(url, email)).toEqual(expected_result)
    }
  )
})
