import {
  theme as idCheckTheme,
  ThemeType as IdCheckThemeType,
} from '@pass-culture/id-check/src/theme'
import deepmerge from 'deepmerge'

export interface AppThemeType extends IdCheckThemeType {
  appBarHeight: number
}

export const theme: AppThemeType = deepmerge(idCheckTheme, {
  appBarHeight: 64,
})
