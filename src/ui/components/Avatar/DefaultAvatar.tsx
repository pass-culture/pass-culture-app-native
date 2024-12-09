import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { BicolorProfile } from 'ui/svg/icons/BicolorProfile'

export const DefaultAvatar = styled(LinearGradient).attrs(({ theme }) => ({
  colors: [theme.colors.secondary, theme.colors.primary],
  useAngle: true,
  angle: -30,
  children: <BicolorProfile color={theme.colors.white} color2={theme.colors.white} size={50} />,
}))({ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' })
