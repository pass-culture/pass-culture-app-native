import { t } from '@lingui/macro'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import styled from 'styled-components/native'

import { i18n, _ } from 'libs/i18n'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

import { useBookings } from '../api'

export const EndedBookings: React.FC = () => {
  const { data: bookings } = useBookings()

  const endedBookingsCount = bookings?.ended_bookings?.length || 0
  const endedBookingsLabel =
    `${endedBookingsCount}\u00a0` +
    i18n.plural({
      value: endedBookingsCount,
      one: 'réservation terminée',
      other: 'réservations terminées',
    })

  return (
    <ScrollView>
      <Spacer.TopScreen />
      <Spacer.Column numberOfSpaces={18} />
      <EndedBookingsCount>{endedBookingsLabel}</EndedBookingsCount>
      <Spacer.Flex />

      <PageHeader title={_(t`Mes réservations terminées`)} />
    </ScrollView>
  )
}

const EndedBookingsCount = styled(Typo.Body)({
  color: ColorsEnum.GREY_DARK,
  paddingHorizontal: getSpacing(5),
})
