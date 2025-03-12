import { theme as themeDarkMobile } from 'design-system/dist/build/jeune/index.dark.mobile'
import { theme as themeDarkWeb } from 'design-system/dist/build/jeune/index.dark.web'
import { theme as themeLightMobile } from 'design-system/dist/build/jeune/index.light.mobile'
import { theme as themeLightWeb } from 'design-system/dist/build/jeune/index.light.web'

export type DesignTokensType =
  | typeof themeDarkMobile
  | typeof themeLightMobile
  | typeof themeDarkWeb
  | typeof themeLightWeb
