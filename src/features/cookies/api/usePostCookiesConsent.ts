import { omit } from 'lodash'
import { useMutation } from 'react-query'

import { api } from 'api/api'
import { getCookiesChoice } from 'features/cookies/helpers/useCookies'

const wait = async (time: number) => new Promise((resolve) => setTimeout(resolve, time))

export function usePostCookiesConsent() {
  return useMutation(async () => {
    await wait(0) // To make the localStorage is up to date before reading it
    const consent = await getCookiesChoice()
    if (consent) {
      await api.postnativev1cookiesConsent(omit(consent, ['buildVersion']))
    }
  })
}
