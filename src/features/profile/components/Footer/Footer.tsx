import React from 'react'
import styled from 'styled-components/native'

import { LogoFrenchRepublic } from 'ui/svg/LogoFrenchRepublic'
import { getSpacing } from 'ui/theme/spacing'

export const Footer = () => (
  <LogoFrenchRepublicContainer>
    <LogoFrenchRepublic />
  </LogoFrenchRepublicContainer>
)

const LogoFrenchRepublicContainer = styled.View(({ theme }) => ({
  width: getSpacing(40),
  height: getSpacing(28),
  marginTop: theme.designSystem.size.spacing.l,
  marginBottom: theme.tabBar.heightV2,
}))
