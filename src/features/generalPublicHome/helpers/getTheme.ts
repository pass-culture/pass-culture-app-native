import { THEMES } from 'features/generalPublicHome/constants'
import { Theme, ThemeId } from 'features/generalPublicHome/types'

export const getTheme = (themeId?: ThemeId): Theme | undefined =>
  THEMES.find((theme) => theme.id === themeId)
