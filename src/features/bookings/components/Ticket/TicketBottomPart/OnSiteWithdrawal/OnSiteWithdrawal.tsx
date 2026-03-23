import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { QrCode } from 'features/bookings/components/Ticket/TicketBottomPart/QrCode'
import { TicketCode } from 'features/bookings/components/Ticket/TicketBottomPart/TicketCode'
import { getDelayMessage } from 'features/bookings/helpers/getDelayMessage'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo, getSpacing } from 'ui/theme'

export const OnSiteWithdrawal = ({
  token,
  isDuo,
  shouldShowExchangeMessage,
  withdrawalDelay,
}: {
  token: string
  isDuo: boolean
  shouldShowExchangeMessage: boolean
  withdrawalDelay?: number | null
}) => {
  const delay = withdrawalDelay ? getDelayMessage(withdrawalDelay) : null
  const displayedDelay = delay ?? ' '
  const text = `Présente le code ci-dessus à l’accueil du lieu indiqué ${displayedDelay}avant le début de l’événement pour récupérer ${isDuo ? 'tes billets' : 'ton billet'}.`

  return (
    <StyledViewGap gap={4} testID="on-site-withdrawal-container">
      <QRCodeContainer>
        {shouldShowExchangeMessage ? (
          <StyledText>{'À échanger contre le billet.'}</StyledText>
        ) : null}
        <QrCode qrCode={token} />
      </QRCodeContainer>
      <TicketCode code={token} text={text} />
    </StyledViewGap>
  )
}

const QRCodeContainer = styled(View)({
  alignItems: 'flex-start',
  alignSelf: 'center',
})

const StyledViewGap = styled(ViewGap)({
  justifyContent: 'center',
  minHeight: getSpacing(25),
})

const StyledText = styled(Typo.BodyAccentXs)(({ theme }) => ({
  textAlign: 'center',
  color: theme.designSystem.color.text.default,
}))
