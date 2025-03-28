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
    <CaptionNeutralInfo>{value}</CaptionNeutralInfo>
  </Container>
)

const Container = styled.View({
  flexDirection: 'row',
  marginTop: getSpacing(3),
  alignItems: 'center',
  justifyContent: 'center',
})

const CaptionNeutralInfo = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
