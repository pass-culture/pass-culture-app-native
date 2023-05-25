import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'

export const Li = styled.View.attrs({
  accessibilityRole: AccessibilityRole.LISTITEM,
})({
  display: Platform.OS === 'web' ? 'list-item' : 'flex',
})
