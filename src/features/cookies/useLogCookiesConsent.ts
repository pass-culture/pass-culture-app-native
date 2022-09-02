import { useMutation } from 'react-query'

import { api } from 'api/api'
import { getCookiesChoice } from 'features/cookies/useCookies'

export function useLogCookiesConsent() {
  return useMutation(async () => {
    setTimeout(
      () =>
        getCookiesChoice().then((consent) => consent && api.postnativev1cookiesConsent(consent)),
      200 // To make the localStorage is up to date before reading it
    )
  })
}
