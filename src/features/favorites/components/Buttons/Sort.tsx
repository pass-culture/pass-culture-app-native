import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Sort as SortIconDefault } from 'ui/svg/icons/Sort'
import { Typo } from 'ui/theme'

export const Sort: FunctionComponent = () => {
  return (
    <Container navigateTo={{ screen: 'FavoritesSorts' }} accessibilityLabel="Trier">
      <StyledView>
        <SortIcon />
        <StyledButtonText>Trier</StyledButtonText>
      </StyledView>
    </Container>
  )
}

const SortIcon = styled(SortIconDefault).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.inverted,
}))``

const Container = styled(InternalTouchableLink).attrs(({ theme }) => ({
  hoverUnderlineColor: theme.designSystem.color.text.inverted,
}))({
  overflow: 'hidden',
})

const StyledView = styled.View(({ theme }) => ({
  backgroundColor: theme.designSystem.color.background.brandPrimary,
  borderRadius: theme.designSystem.size.borderRadius.xl,
  alignItems: 'center',
  flexDirection: 'row',
  overflow: 'hidden',
  paddingHorizontal: theme.designSystem.size.spacing.m,
  height: theme.designSystem.size.spacing.xxxl,
}))

const StyledButtonText = styled(Typo.Button)(({ theme }) => ({
  color: theme.designSystem.color.text.inverted,
  paddingHorizontal: theme.designSystem.size.spacing.s,
}))
