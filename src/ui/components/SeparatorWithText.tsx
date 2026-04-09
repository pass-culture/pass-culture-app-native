import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ColorsType } from 'theme/types'
import { Separator } from 'ui/components/Separator'
import { Typo } from 'ui/theme'

interface SeparatorWithTextProps {
  label: string
  backgroundColor?: ColorsType
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

const Container = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: theme.designSystem.size.spacing.xs,
}))

const StyledLabel = styled(Typo.BodyAccentXs)(({ theme }) => ({
  marginHorizontal: theme.designSystem.size.spacing.m,
}))

const StyledSeparator = styled(Separator.Horizontal)<{ backgroundColor?: ColorsType }>(
  ({ theme, backgroundColor }) => ({
    flex: 1,
    backgroundColor: backgroundColor ?? theme.designSystem.separator.color.subtle,
  })
)
