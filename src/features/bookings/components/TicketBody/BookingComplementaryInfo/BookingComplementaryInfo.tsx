import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { Typo, getSpacing } from 'ui/theme'

type Props = {
  title: string
  value: string
}

export const BookingComplementaryInfo: FunctionComponent<Props> = ({ title, value }) => (
  <Container testID="bookingComplementaryInfo">
    <Typo.Caption>{title}&nbsp;</Typo.Caption>
    <Typo.CaptionNeutralInfo>{value}</Typo.CaptionNeutralInfo>
  </Container>
)

const Container = styled.View({
  flexDirection: 'row',
  marginTop: getSpacing(3),
  alignItems: 'center',
  justifyContent: 'center',
})
