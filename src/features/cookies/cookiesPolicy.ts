export enum CookieCategoriesEnum {
  customization = 'customization',
  performance = 'performance',
  marketing = 'marketing',
  essential = 'essential',
}

export interface CookieCategories {
  [CookieCategoriesEnum.customization]: boolean
  [CookieCategoriesEnum.performance]: boolean
  [CookieCategoriesEnum.marketing]: boolean
  [CookieCategoriesEnum.essential]: true
}

export const acceptAllCookies = {
  customization: true,
  performance: true,
  marketing: true,
}

export const declineAllCookies = {
  customization: false,
  performance: false,
  marketing: false,
}
