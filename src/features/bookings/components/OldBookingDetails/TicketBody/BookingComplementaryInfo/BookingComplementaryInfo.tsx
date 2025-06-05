import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { Typo, getSpacing } from 'ui/theme'

type Props = {
  title: string
  value: string
}

export const BookingComplementaryInfo: FunctionComponent<Props> = ({ title, value }) => (
  <Container testID="bookingComplementaryInfo">
    <Typo.BodyAccentXs>{title}&nbsp;</Typo.BodyAccentXs>
    <StyledBodyAccentXs>{value}</StyledBodyAccentXs>
  </Container>
)

const Container = styled.View({
  flexDirection: 'row',
  marginTop: getSpacing(3),
  alignItems: 'center',
  justifyContent: 'center',
})

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
