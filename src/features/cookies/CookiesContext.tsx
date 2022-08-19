import React, { createContext, memo, useContext, useMemo, useState } from 'react'

export enum CookieCategoriesEnum {
  customization = 'customization',
  performance = 'performance',
  marketing = 'marketing',
  essential = 'essential',
}

interface CookieCategories {
  [CookieCategoriesEnum.customization]: boolean
  [CookieCategoriesEnum.performance]: boolean
  [CookieCategoriesEnum.marketing]: boolean
  [CookieCategoriesEnum.essential]: true
}

type ChangeableCategories = Omit<CookieCategories, CookieCategoriesEnum.essential>

interface CookiesState {
  cookiesChoice: ChangeableCategories
  hasMadeCookiesChoice: boolean
  setCookiesChoice: React.Dispatch<React.SetStateAction<ChangeableCategories>>
  setHasMadeCookiesChoice: React.Dispatch<React.SetStateAction<boolean>>
}

export const CookiesContextProvider = memo(function CookiesContextProvider({
  children,
}: {
  children: JSX.Element
}) {
  const [hasMadeCookiesChoice, setHasMadeCookiesChoice] = useState(false)
  const [cookiesChoice, setCookiesChoice] = useState<ChangeableCategories>({
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
