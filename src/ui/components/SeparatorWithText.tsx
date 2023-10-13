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
      <StyledLabel>{label}</StyledLabel>
      <StyledSeparator />
    </Container>
  )
}

const Container = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: getSpacing(1),
})

const StyledLabel = styled(Typo.Caption)({
  marginHorizontal: getSpacing(2.5),
})

const StyledSeparator = styled(Separator.Horizontal)(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.greySemiDark,
}))
