import { t } from '@lingui/macro'
import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { BookingCancellationReasons } from 'api/gen'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { _ } from 'libs/i18n'
import { InputRule } from 'ui/components/inputs/rules/InputRule'
import { Check } from 'ui/svg/icons/Check'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

import { BookingItemTitle } from './BookingItemTitle'
import { EndedBookingTicket, endedBookingTicketWidth } from './EndedBookingTicket'
import { BookingItemProps } from './types'

export const EndedBookingItem = ({ booking }: BookingItemProps) => {
  const { cancellationDate, cancellationReason, dateUsed, stock } = booking

  const endedBookingReason = getEndedBookingReason(cancellationReason, dateUsed)
  const endedBookingDateLabel = getEndedBookingDateLabel(cancellationDate, dateUsed)

  return (
    <ItemContainer testID="EndedBookingItem">
      <EndedBookingTicket
        image={stock.offer.image?.url}
        offerCategory={stock.offer.category.name}
      />
      <Spacer.Row numberOfSpaces={4} />
      <View>
        <BookingItemTitle ticketWidth={endedBookingTicketWidth} title={stock.offer.name} />
        <EndedReasonAndDate>
          {endedBookingReason}
          <Spacer.Row numberOfSpaces={1} />
          <DateLabel>{endedBookingDateLabel}</DateLabel>
        </EndedReasonAndDate>
      </View>
    </ItemContainer>
  )
}

const ItemContainer = styled.View({
  flexDirection: 'row',
  paddingBottom: getSpacing(7.5),
  paddingHorizontal: getSpacing(5),
})

const EndedReasonAndDate = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const DateLabel = styled(Typo.Caption)({
  color: ColorsEnum.GREY_DARK,
})

function getEndedBookingReason(
  cancellationReason?: BookingCancellationReasons | null,
  dateUsed?: Date | null
) {
  if (dateUsed)
    return (
      <InputRule title={_(t`Utilisé`)} icon={Check} color={ColorsEnum.GREEN_VALID} iconSize={20} />
    )

  if (cancellationReason === BookingCancellationReasons.OFFERER)
    return <InputRule title={_(t`Annulé`)} icon={Check} color={ColorsEnum.ERROR} iconSize={20} />

  return (
    <InputRule
      title={_(t`Réservation annulée`)}
      icon={Check}
      color={ColorsEnum.ERROR}
      iconSize={20}
    />
  )
}

function getEndedBookingDateLabel(cancellationDate?: Date | null, dateUsed?: Date | null) {
  const label = _(t`le\u00a0`)
  if (dateUsed) return label + formatToSlashedFrenchDate(new Date(dateUsed).toISOString())
  if (cancellationDate)
    return label + formatToSlashedFrenchDate(new Date(cancellationDate).toISOString())
  return null
}
