import colorAlpha from 'color-alpha'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { THEMATIC_HEADER_TEXT_BACKGROUND_OPACITY } from 'features/home/components/constants'
import { getSpacing } from 'ui/theme'

export const ThematicHighlightGradient = styled(LinearGradient).attrs(({ theme }) => ({
  colors: [
    colorAlpha(theme.colors.black, 0),
    colorAlpha(theme.colors.black, THEMATIC_HEADER_TEXT_BACKGROUND_OPACITY),
  ],
}))<{ height?: number }>(({ height }) => ({ height: height ?? getSpacing(8) }))
