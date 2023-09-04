import React from 'react'
import styled from 'styled-components/native'

import { Spacer, Typo, getSpacing } from 'ui/theme'

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

const StyledButtonText = styled(Typo.ButtonText).attrs({ numberOfLines: 3 })({
  marginLeft: getSpacing(1.5),
  justifyContent: 'center',
})
const StyledCaption = styled(Typo.Caption)({
  marginLeft: getSpacing(1.5),
  justifyContent: 'center',
})
