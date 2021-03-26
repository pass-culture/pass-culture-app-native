import { t } from '@lingui/macro'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

import { useBookings } from '../api'
import { EndedBookingsList } from '../components/EndedBookingList'

export const EndedBookings: React.FC = () => {
  const { data: bookings } = useBookings()

  const endedBookingsCount = bookings?.ended_bookings?.length || 0
  const endedBookingsLabel =
    `${endedBookingsCount}\u00a0` + getEndedBookingsCountLabel(endedBookingsCount > 1)

  return (
    <ScrollView>
      <Spacer.TopScreen />
      <Spacer.Column numberOfSpaces={18} />
      <EndedBookingsCount>{endedBookingsLabel}</EndedBookingsCount>
      <EndedBookingsList bookings={bookings?.ended_bookings} />

      <PageHeader title={_(t`Mes réservations terminées`)} />
    </ScrollView>
  )
}

const getEndedBookingsCountLabel = (plural: boolean) =>
  plural ? _(t`réservations terminées`) : _(t`réservation terminée`)

const EndedBookingsCount = styled(Typo.Body)({
  color: ColorsEnum.GREY_DARK,
  paddingHorizontal: getSpacing(5),
})
