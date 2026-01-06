import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { BookingListItemResponse } from 'api/gen'
import { ENDED_BOOKING_REASONS } from 'features/bookings/constants'
import { getEndedBookingReason } from 'features/bookings/helpers/getEndedBookingReason'
import { InputRule } from 'ui/components/inputs/rules/InputRule'

type Props = {
  booking: BookingListItemResponse
  isEligibleBookingsForArchiveValue?: boolean
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
