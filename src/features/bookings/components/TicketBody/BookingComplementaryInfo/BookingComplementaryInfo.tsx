import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { TypoDS, getSpacing } from 'ui/theme'

type Props = {
  title: string
  value: string
}

export const BookingComplementaryInfo: FunctionComponent<Props> = ({ title, value }) => (
  <Container testID="bookingComplementaryInfo">
    <TypoDS.BodyAccentXs>{title}&nbsp;</TypoDS.BodyAccentXs>
    <CaptionNeutralInfo>{value}</CaptionNeutralInfo>
  </Container>
)

const Container = styled.View({
  flexDirection: 'row',
  marginTop: getSpacing(3),
  alignItems: 'center',
  justifyContent: 'center',
})

const CaptionNeutralInfo = styled(TypoDS.BodyAccentXs)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
