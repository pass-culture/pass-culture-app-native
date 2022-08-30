import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { Consent, CookiesConsent } from 'features/cookies/CookiesPolicy'
import { storage } from 'libs/storage'

export const COOKIES_CONSENT_KEY = 'cookies_consent'

export const getCookiesChoice = async () =>
  await storage.readObject<CookiesConsent>(COOKIES_CONSENT_KEY)

export const useCookies = () => {
  const [cookiesConsent, setCookiesConsent] = useState<Consent>()

  useEffect(() => {
    getCookiesChoice().then((value) => {
      if (value) {
        setCookiesConsent(value.consent)
      }
    })
  }, [])

  useEffect(() => {
    const deviceId = uuidv4()
    if (cookiesConsent) {
      storage.saveObject(COOKIES_CONSENT_KEY, {
        deviceId,
        choiceDatetime: new Date(),
        consent: cookiesConsent,
      })
    }
  }, [cookiesConsent])

  return {
    cookiesConsent,
    setCookiesConsent,
  }
}
