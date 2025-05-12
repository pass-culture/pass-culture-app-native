/* eslint-disable no-restricted-imports */
// it the only file we need to import theme from design system
import {
  theme as themeDarkMobile,
  ColorsType as ColorsTypeDarkMobile,
} from 'design-system/dist/build/jeune/index.dark.mobile'
import {
  theme as themeDarkWeb,
  ColorsType as ColorsTypeDarkWeb,
} from 'design-system/dist/build/jeune/index.dark.web'
import {
  theme as themeLightMobile,
  ColorsType as ColorsTypeLightMobile,
} from 'design-system/dist/build/jeune/index.light.mobile'
import {
  theme as themeLightWeb,
  ColorsType as ColorsTypeLightWeb,
} from 'design-system/dist/build/jeune/index.light.web'

import { ColorsEnum, UniqueColors } from 'ui/theme/colors'

export type ColorsType =
  | ColorsTypeDarkMobile
  | ColorsTypeDarkWeb
  | ColorsTypeLightMobile
  | ColorsTypeLightWeb

export type ColorsTypeLegacy = ColorsEnum | UniqueColors | ColorsType

export type DesignTokensType =
  | typeof themeDarkMobile
  | typeof themeLightMobile
  | typeof themeDarkWeb
  | typeof themeLightWeb

export type TextColorKey = keyof DesignTokensType['color']['text']
export type IconColorKey = keyof DesignTokensType['color']['icon']
export type BorderColorKey = keyof DesignTokensType['color']['border']
export type BackgroundColorKey = keyof DesignTokensType['color']['background']
