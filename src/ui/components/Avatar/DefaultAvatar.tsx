import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { Profile } from 'ui/svg/icons/Profile'

export const DefaultAvatar = styled(LinearGradient).attrs<{
  colors?: string[]
}>(({ theme, colors }) => ({
  colors: colors || [
    theme.designSystem.color.icon.brandPrimary,
    theme.designSystem.color.icon.brandPrimary,
  ],
  useAngle: true,
  angle: -30,
  children: <Profile color={theme.designSystem.color.icon.lockedInverted} size={50} />,
}))({ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' })
