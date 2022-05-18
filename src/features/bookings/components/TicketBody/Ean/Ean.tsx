import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { BookingOfferResponse } from 'api/gen'
import { Typo, getSpacing } from 'ui/theme'

type Props = {
  offer: BookingOfferResponse
}

export const Ean: FunctionComponent<Props> = ({ offer }) => (
  <EANContainer>
    <Typo.Caption>{t`EAN` + '\u00a0'}</Typo.Caption>
    <DarkGreyCaption>{offer.extraData?.isbn}</DarkGreyCaption>
  </EANContainer>
)

const EANContainer = styled.View({
  flexDirection: 'row',
  marginTop: getSpacing(3),
  alignItems: 'center',
  justifyContent: 'center',
})

const DarkGreyCaption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
