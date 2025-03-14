/* eslint-disable no-restricted-imports */
// it the only file we need to import theme from design system
import { theme as themeDark } from 'design-system/dist/build/jeune/index.dark.web'
import { theme as themeLight } from 'design-system/dist/build/jeune/index.light.web'

import { DesignTokensType } from 'theme/types'

export const designTokensLight: DesignTokensType = themeLight
export const designTokensDark: DesignTokensType = themeDark
