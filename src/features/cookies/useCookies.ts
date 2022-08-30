import { useEffect, useState } from 'react'

import { CookiesConsent } from 'features/cookies/CookiesPolicy'
import { storage } from 'libs/storage'

export const COOKIES_CONSENT_KEY = 'cookies_consent'

export const getCookiesChoice = async () =>
  await storage.readObject<CookiesConsent>(COOKIES_CONSENT_KEY)

export const useCookies = () => {
  const [cookiesChoice, setCookiesChoice] = useState<CookiesConsent>()

  useEffect(() => {
    getCookiesChoice().then((value) => {
      if (value) setCookiesChoice(value)
    })
  }, [])

  useEffect(() => {
    if (cookiesChoice) {
      storage.saveObject(COOKIES_CONSENT_KEY, cookiesChoice)
    }
  }, [cookiesChoice])

  return {
    cookiesChoice,
    setCookiesChoice,
  }
}
