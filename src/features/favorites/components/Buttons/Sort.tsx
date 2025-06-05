import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Sort as SortIconDefault } from 'ui/svg/icons/Sort'
import { getSpacing, Typo } from 'ui/theme'

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
  borderRadius: theme.borderRadius.button,
  alignItems: 'center',
  flexDirection: 'row',
  overflow: 'hidden',
  paddingHorizontal: getSpacing(3),
  height: getSpacing(10),
}))

const StyledButtonText = styled(Typo.Button)(({ theme }) => ({
  color: theme.designSystem.color.text.inverted,
  marginLeft: getSpacing(1),
  marginRight: getSpacing(2),
}))
