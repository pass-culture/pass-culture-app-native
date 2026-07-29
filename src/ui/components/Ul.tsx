import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { getSpacing } from 'ui/theme'

export const Ul = styled.View.attrs({ accessibilityRole: AccessibilityRole.LIST })({
  paddingLeft: 0,
  flexDirection: 'row',
  overflow: Platform.OS === 'web' ? 'auto' : undefined,
})

export const VerticalUl = styled(Ul)<{ gap?: number }>(({ gap = 0 }) => ({
  flexDirection: 'column',
  gap: getSpacing(gap),
}))
