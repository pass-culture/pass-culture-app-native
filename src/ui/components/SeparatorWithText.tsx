import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { Separator } from 'ui/components/Separator'
import { getSpacing, Typo, ColorsEnum } from 'ui/theme'

interface SeparatorWithTextProps {
  label: string
  backgroundColor?: ColorsEnum
}

export const SeparatorWithText: FunctionComponent<SeparatorWithTextProps> = ({
  label,
  backgroundColor,
}) => {
  return (
    <Container>
      <StyledSeparator backgroundColor={backgroundColor} />
      <StyledLabel>{label}</StyledLabel>
      <StyledSeparator backgroundColor={backgroundColor} />
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

const StyledSeparator = styled(Separator.Horizontal)<{ backgroundColor?: ColorsEnum }>(
  ({ theme, backgroundColor }) => ({
    flex: 1,
    backgroundColor: backgroundColor ?? theme.colors.greySemiDark,
  })
)
