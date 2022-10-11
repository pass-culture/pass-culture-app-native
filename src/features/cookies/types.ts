import { CookieCategoriesEnum, CookieNameEnum } from 'features/cookies/enums'

export type Cookies = CookieNameEnum[]

export interface Consent {
  mandatory: Cookies
  accepted: Cookies
  refused: Cookies
}

export type CookiesConsent =
  | {
      buildVersion: number
      choiceDatetime: string
      consent: Consent
      deviceId: string
      userId?: number
    }
  | {
      buildVersion: number
      deviceId: string
      userId: number
      consent?: never
      choiceDatetime?: never
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
