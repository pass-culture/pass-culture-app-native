import { THEMES } from 'features/generalPublicHome/mocks/themes'
import { Theme, ThemeId } from 'features/generalPublicHome/types'

export const getTheme = (themeId?: ThemeId): Theme | undefined =>
  THEMES.find((theme) => theme.id === themeId)
