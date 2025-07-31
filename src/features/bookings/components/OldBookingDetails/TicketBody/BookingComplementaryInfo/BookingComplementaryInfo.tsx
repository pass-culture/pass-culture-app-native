import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'

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

const Container = styled.View(({ theme }) => ({
  flexDirection: 'row',
  marginTop: theme.designSystem.size.spacing.m,
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
