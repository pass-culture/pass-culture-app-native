/* eslint-disable no-restricted-imports */
// it the only file we need to import theme from design system
import { theme as themeDark } from 'design-system/dist/build/jeune/index.dark.mobile'
import { theme as themeLight } from 'design-system/dist/build/jeune/index.light.mobile'

import { DesignTokensType } from 'theme/types'

export const designTokensLight: DesignTokensType = themeLight
export const designTokensDark: DesignTokensType = themeDark
