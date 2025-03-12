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
