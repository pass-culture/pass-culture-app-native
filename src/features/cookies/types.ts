import { CookieCategoriesEnum, CookieNameEnum } from 'features/cookies/enums'

export type Cookies = CookieNameEnum[]

export interface Consent {
  mandatory: Cookies
  accepted: Cookies
  refused: Cookies
}

export interface CookiesConsent {
  consent: Consent
  deviceId: string
  choiceDatetime: string
  userId?: number
}

export type CookiesChoiceByCategory = {
  [CookieCategoriesEnum.marketing]: boolean
  [CookieCategoriesEnum.performance]: boolean
  [CookieCategoriesEnum.customization]: boolean
}

export interface CookiesChoiceSettings {
  settingsCookiesChoice: CookiesChoiceByCategory
  setSettingsCookiesChoice: React.Dispatch<React.SetStateAction<CookiesChoiceByCategory>>
}
