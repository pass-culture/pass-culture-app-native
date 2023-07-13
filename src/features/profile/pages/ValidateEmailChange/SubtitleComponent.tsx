import React from 'react'
import styled from 'styled-components/native'

import { getSpacing, Typo } from 'ui/theme'
import { TextProps } from 'ui/theme/typography'

export function ValidateEmailChangeSubtitleComponent(props: TextProps) {
  return (
    <Wrapper>
      <Typo.ButtonText>Nouvelle adresse e-mail&nbsp;:</Typo.ButtonText>
      <Typo.Body {...props} />
    </Wrapper>
  )
}

const Wrapper = styled.View({
  marginTop: getSpacing(4),
  alignItems: 'center',
})
