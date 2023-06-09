import { PropsWithChildren } from 'react'
import { Platform, View } from 'react-native'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'

export const Ul: React.FC<PropsWithChildren> = styled(View).attrs({
  accessibilityRole: AccessibilityRole.LIST,
})({
  paddingLeft: 0,
  flexDirection: 'row',
  overflow: Platform.OS === 'web' ? 'auto' : undefined,
})

export const VerticalUl: React.FC<PropsWithChildren> = styled(Ul)({
  flexDirection: 'column',
})
