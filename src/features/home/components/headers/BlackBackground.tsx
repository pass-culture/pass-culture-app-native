import colorAlpha from 'color-alpha'
import styled from 'styled-components/native'

import { THEMATIC_HEADER_TEXT_BACKGROUND_OPACITY } from 'features/home/components/constants'
import { getSpacing } from 'ui/theme'

export const BlackBackground = styled.View(({ theme }) => ({
  paddingHorizontal: getSpacing(6),
  paddingBottom: getSpacing(4),
  paddingTop: getSpacing(2),
  backgroundColor: colorAlpha(theme.colors.black, THEMATIC_HEADER_TEXT_BACKGROUND_OPACITY),
}))
