import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { Separator } from 'ui/components/Separator'
import { getSpacing, Typo } from 'ui/theme'

interface SeparatorWithTextProps {
  label: string
}
export const SeparatorWithText: FunctionComponent<SeparatorWithTextProps> = ({ label }) => {
  return (
    <Container>
      <StyledSeparator />
      <StyledBody>{label}</StyledBody>
      <StyledSeparator />
    </Container>
  )
}

const Container = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: getSpacing(1),
})

const StyledBody = styled(Typo.Body)({
  marginHorizontal: getSpacing(2.5),
})

export const StyledSeparator = styled(Separator)(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.greySemiDark,
}))
