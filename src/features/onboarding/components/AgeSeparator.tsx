import React from 'react'
import styled from 'styled-components/native'

import { Separator } from 'ui/components/Separator'
import { getSpacing, Typo } from 'ui/theme'

export const AgeSeparator = ({ isEighteen }: { isEighteen: boolean }) => {
  return (
    <Container>
      <StyledSeparator />
      <StyledBody>{isEighteen ? 'pour les plus jeunes' : 'remise à 0 du crédit'}</StyledBody>
      <StyledSeparator />
    </Container>
  )
}

const Container = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  padding: getSpacing(1),
})

const StyledBody = styled(Typo.Body)({
  margin: getSpacing(2.5),
})

export const StyledSeparator = styled(Separator)(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.greySemiDark,
}))
