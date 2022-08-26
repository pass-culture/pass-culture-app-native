import { useEffect, useState } from 'react'

import {
  allOptionalCookies,
  CookieCategories,
  COOKIES_BY_CATEGORY,
} from 'features/cookies/cookiesPolicy'
import { storage } from 'libs/storage'

export const COOKIES_CONSENT_KEY = 'cookies_consent'

export const getCookiesChoice = async () =>
  await storage.readObject<CookieCategories>(COOKIES_CONSENT_KEY)

export const useCookies = () => {
  const [cookiesChoice, setCookiesChoice] = useState<CookieCategories>({
    mandatory: COOKIES_BY_CATEGORY.essential,
    accepted: [],
    refused: allOptionalCookies,
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
