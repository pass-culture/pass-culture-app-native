import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { BookingListItemResponse } from 'api/gen'
import {
  getEndedBookingReason,
  EndedBookingReasonKey,
} from 'features/bookings/helpers/getEndedBookingReason'
import { InputRule } from 'ui/components/inputs/rules/InputRule'
import { Valid } from 'ui/svg/icons/Valid'
import { Wrong } from 'ui/svg/icons/Wrong'

type Props = {
  booking: BookingListItemResponse
  isEligibleBookingsForArchiveValue?: boolean
}

type EndedBookingReason = {
  title: string
  icon: typeof Valid | typeof Wrong
  type: 'Valid' | 'Error'
}

const ENDED_BOOKING_REASONS: Record<EndedBookingReasonKey, EndedBookingReason> = {
  USED: { title: 'Réservation utilisée', icon: Valid, type: 'Valid' },
  CANCELLED_BY_OFFERER: { title: 'Annulée', icon: Wrong, type: 'Error' },
  ARCHIVED: { title: 'Réservation archivée', icon: Valid, type: 'Valid' },
  CANCELLED: { title: 'Réservation annulée', icon: Wrong, type: 'Error' },
}

export const EndedBookingReason: FunctionComponent<Props> = ({
  booking,
  isEligibleBookingsForArchiveValue,
}) => {
  const { cancellationReason, dateUsed } = booking

  const { title, icon, type } =
    ENDED_BOOKING_REASONS[
      getEndedBookingReason(!!dateUsed, cancellationReason, isEligibleBookingsForArchiveValue)
    ]

  return <StyledInputRule title={title} icon={icon} type={type} noFullWidth />
}

const StyledInputRule = styled(InputRule).attrs<{ iconSize?: number }>(({ theme }) => ({
  iconSize: theme.icons.sizes.smaller,
}))``
