import React from 'react'
import styled from 'styled-components/native'

import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo, getSpacing } from 'ui/theme'

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

const StyledButtonText = styled(Typo.BodyAccent).attrs({ numberOfLines: 3 })({
  marginLeft: getSpacing(1.5),
  justifyContent: 'center',
})
const StyledCaption = styled(Typo.BodyAccentXs)({
  marginLeft: getSpacing(1.5),
  justifyContent: 'center',
})
