import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { Typo, getSpacing } from 'ui/theme'

type Props = {
  isbn: string
}

export const Ean: FunctionComponent<Props> = ({ isbn }) => (
  <EANContainer testID="ean">
    <Typo.Caption>EAN&nbsp;</Typo.Caption>
    <Typo.CaptionNeutralInfo>{isbn}</Typo.CaptionNeutralInfo>
  </EANContainer>
)

const EANContainer = styled.View({
  flexDirection: 'row',
  marginTop: getSpacing(3),
  alignItems: 'center',
  justifyContent: 'center',
})
