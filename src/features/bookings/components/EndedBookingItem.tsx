import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { BookingCancellationReasons } from 'api/gen'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { _ } from 'libs/i18n'
import { getSpacing, Typo } from 'ui/theme'

import { BookingItemProps } from './types'

export const EndedBookingItem = ({ booking }: BookingItemProps) => {
  const { cancellationDate, cancellationReason, dateUsed, stock } = booking

  const endedBookingReason = getEndedBookingReason(cancellationReason, dateUsed)
  const endedBookingDateLabel = getEndedBookingDateLabel(cancellationDate, dateUsed)

  return (
    <ItemContainer testID="EndedBookingItem">
      <Typo.ButtonText>{stock.offer.name}</Typo.ButtonText>
      <Typo.Caption>{endedBookingReason}</Typo.Caption>
      <Typo.Caption>{endedBookingDateLabel}</Typo.Caption>
    </ItemContainer>
  )
}

function getEndedBookingReason(
  cancellationReason?: BookingCancellationReasons | null,
  dateUsed?: Date | null
): string {
  if (dateUsed) return _(t`Utilisé`)
  if (cancellationReason === BookingCancellationReasons.OFFERER) return _(t`Annulé`)
  return _(t`Réservation annulée`)
}

function getEndedBookingDateLabel(cancellationDate?: Date | null, dateUsed?: Date | null) {
  const label = _(t`le\u00a0`)
  if (dateUsed) return label + formatToSlashedFrenchDate(new Date(dateUsed).toISOString())
  if (cancellationDate)
    return label + formatToSlashedFrenchDate(new Date(cancellationDate).toISOString())
  return null
}

const ItemContainer = styled.View({
  flexDirection: 'column',
  padding: getSpacing(4),
})
