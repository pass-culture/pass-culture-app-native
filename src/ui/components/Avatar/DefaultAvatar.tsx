import React from 'react'
import styled from 'styled-components/native'

import { Profile } from 'ui/svg/icons/Profile'

export const DefaultAvatar = styled.View.attrs<{
  colors?: string[]
  size?: number
}>(({ theme, size = theme.designSystem.size.icon.m }) => ({
  children: <Profile color={theme.designSystem.color.icon.subtle} size={size} />,
}))(({ theme }) => ({
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.designSystem.color.background.subtle,
  borderWidth: 1,
  borderColor: theme.designSystem.color.border.subtle,
  borderRadius: theme.designSystem.size.borderRadius.pill,
}))
