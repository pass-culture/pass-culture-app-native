import React from 'react'
import styled from 'styled-components/native'

import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'

interface Props {
  title: string
  subtitle: string
}

export const InformationStepContent = ({ title, subtitle }: Props) => {
  return (
    <ViewGap gap={1}>
      <StyledButtonText>{title}</StyledButtonText>
      <StyledCaption>{subtitle}</StyledCaption>
    </ViewGap>
  )
}

const StyledButtonText = styled(Typo.BodyAccent).attrs({ numberOfLines: 3 })(({ theme }) => ({
  marginLeft: theme.designSystem.size.spacing.s,
  justifyContent: 'center',
}))

const StyledCaption = styled(Typo.BodyAccentXs)(({ theme }) => ({
  marginLeft: theme.designSystem.size.spacing.s,
  justifyContent: 'center',
}))
