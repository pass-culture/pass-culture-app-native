import colorAlpha from 'color-alpha'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { HIGHLIGHT_TEXT_BACKGROUND_OPACITY } from 'features/home/components/constants'
import { getSpacing } from 'ui/theme'

export const ThematicHighlightGradient = styled(LinearGradient).attrs(({ theme }) => ({
  colors: [
    colorAlpha(theme.colors.black, 0),
    colorAlpha(theme.colors.black, HIGHLIGHT_TEXT_BACKGROUND_OPACITY),
  ],
}))({ height: getSpacing(8) })
