import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { Consent, CookiesConsent } from 'features/cookies/types'
import { storage } from 'libs/storage'

import Package from '../../../../package.json'

const COOKIES_CONSENT_KEY = 'cookies_consent'

export const getCookiesChoice = async () =>
  await storage.readObject<CookiesConsent>(COOKIES_CONSENT_KEY)

export const useCookies = () => {
  const [cookiesConsent, setCookiesConsentInternalState] = useState<Consent>()

  useEffect(() => {
    getCookiesChoice().then((value) => {
      if (value) {
        setCookiesConsentInternalState(value.consent)
      }
    })
  }, [])

  const setCookiesConsent = async (cookiesConsent: Consent) => {
    setCookiesConsentInternalState(cookiesConsent)

    const oldCookiesChoice = await getCookiesChoice()
    const newCookiesChoice = {
      buildVersion: Package.build,
      userId: oldCookiesChoice?.userId,
      deviceId: oldCookiesChoice?.deviceId ?? uuidv4(),
      choiceDatetime: new Date().toISOString(),
      consent: cookiesConsent,
    }
    await storage.saveObject(COOKIES_CONSENT_KEY, newCookiesChoice)
  }

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
