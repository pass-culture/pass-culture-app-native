import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { Consent, CookiesConsent } from 'features/cookies/types'
import { storage } from 'libs/storage'

const COOKIES_CONSENT_KEY = 'cookies_consent'

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
    if (cookiesConsent) {
      getCookiesChoice().then((value) => {
        storage.saveObject(COOKIES_CONSENT_KEY, {
          userId: value?.userId,
          deviceId: value?.deviceId ?? uuidv4(),
          choiceDatetime: new Date().toISOString(),
          consent: cookiesConsent,
        })
      })
    }
  }, [cookiesConsent])

  const setUserId = async (userId: number): Promise<void> => {
    const cookiesChoice = await getCookiesChoice()
    await storage.saveObject(COOKIES_CONSENT_KEY, {
      ...cookiesChoice,
      userId,
    })
  }

  return {
    cookiesConsent,
    setCookiesConsent,
    setUserId,
  }
}
