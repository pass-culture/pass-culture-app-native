/* eslint-disable no-restricted-imports */
// it the only file we need to import theme from design system
import { theme as themeDark } from '@pass-culture/design-system/lib/jeune/dark.mobile'
import { theme as themeLight } from '@pass-culture/design-system/lib/jeune/light.mobile'

import { DesignTokensType } from 'theme/types'

export const designTokensLight: DesignTokensType = themeLight
export const designTokensDark: DesignTokensType = themeDark
