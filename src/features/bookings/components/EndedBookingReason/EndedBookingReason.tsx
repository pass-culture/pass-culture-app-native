import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { BookingCancellationReasons, BookingResponse } from 'api/gen'
import { InputRule } from 'ui/components/inputs/rules/InputRule'
import { Valid } from 'ui/svg/icons/Valid'
import { Wrong } from 'ui/svg/icons/Wrong'

type Props = {
  booking: BookingResponse
  isEligibleBookingsForArchiveValue?: boolean
}

export const EndedBookingReason: FunctionComponent<Props> = ({
  booking,
  isEligibleBookingsForArchiveValue,
}) => {
  const { cancellationReason, dateUsed } = booking

  if (dateUsed) {
    return <StyledInputRule title="Réservation utilisée" icon={Valid} type="Valid" noFullWidth />
  }

  if (cancellationReason === BookingCancellationReasons.OFFERER) {
    return <StyledInputRule title="Annulée" icon={Wrong} type="Error" noFullWidth />
  }

  if (!!isEligibleBookingsForArchiveValue && !cancellationReason) {
    return <StyledInputRule title="Réservation archivée" icon={Valid} type="Valid" noFullWidth />
  }

  return <StyledInputRule title="Réservation annulée" icon={Wrong} type="Error" noFullWidth />
}

const StyledInputRule = styled(InputRule).attrs<{ iconSize?: number }>(({ theme }) => ({
  iconSize: theme.icons.sizes.smaller,
}))``
