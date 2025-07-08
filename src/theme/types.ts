/* eslint-disable no-restricted-imports */
// it the only file we need to import theme from design system
import {
  theme as themeDarkMobile,
  ColorsType as ColorsTypeDarkMobile,
} from '@pass-culture/design-system/lib/jeune/dark.mobile'
import {
  theme as themeDarkWeb,
  ColorsType as ColorsTypeDarkWeb,
} from '@pass-culture/design-system/lib/jeune/dark.web'
import {
  theme as themeLightMobile,
  ColorsType as ColorsTypeLightMobile,
} from '@pass-culture/design-system/lib/jeune/light.mobile'
import {
  theme as themeLightWeb,
  ColorsType as ColorsTypeLightWeb,
} from '@pass-culture/design-system/lib/jeune/light.web'

export type ColorsType =
  | ColorsTypeDarkMobile
  | ColorsTypeDarkWeb
  | ColorsTypeLightMobile
  | ColorsTypeLightWeb

export type DesignTokensType =
  | typeof themeDarkMobile
  | typeof themeLightMobile
  | typeof themeDarkWeb
  | typeof themeLightWeb

export type TextColorKey = keyof DesignTokensType['color']['text']
export type IconColorKey = keyof DesignTokensType['color']['icon']
export type BorderColorKey = keyof DesignTokensType['color']['border']
export type BackgroundColorKey = keyof DesignTokensType['color']['background']
