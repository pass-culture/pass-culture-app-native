import React, { FunctionComponent } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Sort as SortIconDefault } from 'ui/svg/icons/Sort'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'

export const Sort: FunctionComponent = () => {
  return (
    <Container navigateTo={{ screen: 'FavoritesSorts' }} accessibilityLabel="Trier">
      <StyledLinearGradient>
        <SortIcon />
        <Spacer.Row numberOfSpaces={1} />
        <StyledButtonText>Trier</StyledButtonText>
        <Spacer.Row numberOfSpaces={2} />
      </StyledLinearGradient>
    </Container>
  )
}

const SortIcon = styled(SortIconDefault).attrs(({ theme }) => ({
  color: theme.colors.white,
}))``

const Container = styled(InternalTouchableLink).attrs(({ theme }) => ({
  hoverUnderlineColor: theme.colors.white,
}))({
  overflow: 'hidden',
})

const StyledLinearGradient = styled(LinearGradient).attrs(({ theme }) => ({
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
  colors: [theme.colors.primary, theme.colors.secondary],
}))(({ theme }) => ({
  backgroundColor: theme.colors.primary,
  borderRadius: theme.borderRadius.button,
  alignItems: 'center',
  flexDirection: 'row',
  overflow: 'hidden',
  paddingHorizontal: getSpacing(3),
  height: getSpacing(10),
}))

const StyledButtonText = styled(TypoDS.Button)(({ theme }) => ({
  color: theme.colors.white,
}))
