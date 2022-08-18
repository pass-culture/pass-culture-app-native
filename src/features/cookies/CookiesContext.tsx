import React, { createContext, memo, useContext, useMemo, useState } from 'react'

interface CookieCategories {
  customization: boolean
  performance: boolean
  marketing: boolean
}

interface CookiesState {
  cookiesChoice: CookieCategories
  hasMadeCookiesChoice: boolean
  setCookiesChoice: React.Dispatch<React.SetStateAction<CookieCategories>>
  setHasMadeCookiesChoice: React.Dispatch<React.SetStateAction<boolean>>
}

export const CookiesContextProvider = memo(function CookiesContextProvider({
  children,
}: {
  children: JSX.Element
}) {
  const [hasMadeCookiesChoice, setHasMadeCookiesChoice] = useState(false)
  const [cookiesChoice, setCookiesChoice] = useState<CookieCategories>({
    customization: false,
    performance: false,
    marketing: false,
  })

  const value = useMemo(
    () => ({ cookiesChoice, hasMadeCookiesChoice, setCookiesChoice, setHasMadeCookiesChoice }),
    [cookiesChoice, hasMadeCookiesChoice, setCookiesChoice, setHasMadeCookiesChoice]
  )

  return <CookiesContext.Provider value={value}>{children}</CookiesContext.Provider>
})

const CookiesContext = createContext<CookiesState>({
  cookiesChoice: {
    customization: false,
    performance: false,
    marketing: false,
  },
  hasMadeCookiesChoice: false,
  setCookiesChoice: () => null,
  setHasMadeCookiesChoice: () => null,
})

export function useCookiesContext(): CookiesState {
  return useContext(CookiesContext)
}
