import React from 'react'
import styled from 'styled-components/native'

import { Spacer, TypoDS, getSpacing } from 'ui/theme'

interface Props {
  title: string
  subtitle: string
}

export const InformationStepContent = ({ title, subtitle }: Props) => {
  return (
    <React.Fragment>
      <StyledButtonText>{title}</StyledButtonText>
      <Spacer.Column numberOfSpaces={1} />
      <StyledCaption>{subtitle}</StyledCaption>
    </React.Fragment>
  )
}

const StyledButtonText = styled(TypoDS.BodyAccent).attrs({ numberOfLines: 3 })({
  marginLeft: getSpacing(1.5),
  justifyContent: 'center',
})
const StyledCaption = styled(TypoDS.BodyAccentXs)({
  marginLeft: getSpacing(1.5),
  justifyContent: 'center',
})
