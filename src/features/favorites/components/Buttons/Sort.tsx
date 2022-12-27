import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Sort as SortIconDefault } from 'ui/svg/icons/Sort'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const Sort: React.FC = () => {
  return (
    <Container navigateTo={{ screen: 'FavoritesSorts' }} accessibilityLabel="Trier">
      <StyledLinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={['#bf275f', '#5a0d80']}>
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

const StyledLinearGradient = styled(LinearGradient)(({ theme }) => ({
  backgroundColor: theme.colors.primary,
  borderRadius: theme.borderRadius.button,
  alignItems: 'center',
  flexDirection: 'row',
  overflow: 'hidden',
  paddingHorizontal: getSpacing(3),
  height: getSpacing(10),
}))

const StyledButtonText = styled(Typo.ButtonText)(({ theme }) => ({
  color: theme.colors.white,
}))
