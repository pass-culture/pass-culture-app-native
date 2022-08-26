import React, { createContext, memo, useContext, useEffect, useMemo, useState } from 'react'

import {
  CookieCategories,
  CookieCategoriesEnum,
  declineAllCookies,
} from 'features/cookies/cookiesPolicy'
import { storage } from 'libs/storage'

type ChangeableCategories = Omit<CookieCategories, CookieCategoriesEnum.essential>

interface CookiesState {
  cookiesChoice: ChangeableCategories
  setCookiesChoice: React.Dispatch<React.SetStateAction<ChangeableCategories>>
}

const COOKIES_CONSENT_KEY = 'cookies_consent'

export const getCookiesChoice = async () =>
  await storage.readObject<ChangeableCategories>(COOKIES_CONSENT_KEY)

export const CookiesContextProvider = memo(function CookiesContextProvider({
  children,
}: {
  children: JSX.Element
}) {
  const [cookiesChoice, setCookiesChoice] = useState<ChangeableCategories>(declineAllCookies)

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
  cookiesChoice: declineAllCookies,
  setCookiesChoice: () => null,
})

export function useCookiesContext(): CookiesState {
  return useContext(CookiesContext)
}
