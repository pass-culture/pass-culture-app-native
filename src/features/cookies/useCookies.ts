import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import {
  allOptionalCookies,
  CookiesConsent,
  COOKIES_BY_CATEGORY,
} from 'features/cookies/CookiesPolicy'
import { storage } from 'libs/storage'

export const COOKIES_CONSENT_KEY = 'cookies_consent'

export const getCookiesChoice = async () =>
  await storage.readObject<CookiesConsent>(COOKIES_CONSENT_KEY)

export const useCookies = () => {
  const deviceId = uuidv4()
  const [cookiesChoice, setCookiesChoice] = useState<CookiesConsent>({
    consent: {
      mandatory: COOKIES_BY_CATEGORY.essential,
      accepted: [],
      refused: allOptionalCookies,
    },
    deviceId,
  })

  useEffect(() => {
    getCookiesChoice().then((value) => {
      if (value) setCookiesChoice(value)
    })
  }, [])

  useEffect(() => {
    storage.saveObject(COOKIES_CONSENT_KEY, cookiesChoice)
  }, [cookiesChoice])

  return {
    cookiesChoice,
    setCookiesChoice,
  }
}
