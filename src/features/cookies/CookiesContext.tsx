import React, { createContext, memo, useContext, useEffect, useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import {
  CookieCategories,
  CookieCategoriesEnum,
  declineAllCookies,
} from 'features/cookies/cookiesPolicy'
import { storage } from 'libs/storage'

type ChangeableCategories = Omit<CookieCategories, CookieCategoriesEnum.essential>

interface CookiesConsent {
  consent: ChangeableCategories
  deviceId?: string
}

interface CookiesState {
  cookiesChoice: CookiesConsent
  setCookiesChoice: React.Dispatch<React.SetStateAction<CookiesConsent>>
}

const COOKIES_CONSENT_KEY = 'cookies_consent'

export const getCookiesChoice = async () =>
  await storage.readObject<CookiesConsent>(COOKIES_CONSENT_KEY)

export const CookiesContextProvider = memo(function CookiesContextProvider({
  children,
}: {
  children: JSX.Element
}) {
  const deviceId = uuidv4()
  const [cookiesChoice, setCookiesChoice] = useState<CookiesConsent>({
    consent: declineAllCookies,
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

  const value = useMemo(
    () => ({ cookiesChoice, setCookiesChoice }),
    [cookiesChoice, setCookiesChoice]
  )

  return <CookiesContext.Provider value={value}>{children}</CookiesContext.Provider>
})

const CookiesContext = createContext<CookiesState>({
  cookiesChoice: {
    consent: declineAllCookies,
    deviceId: undefined,
  },
  setCookiesChoice: () => null,
})

export function useCookiesContext(): CookiesState {
  return useContext(CookiesContext)
}
