import { plural } from '@lingui/macro'
import { useNavigation } from '@react-navigation/core'
import React from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { Badge } from 'ui/components/Badge'
import { SectionRow } from 'ui/components/SectionRow'

import { useBookings } from '../api/queries'

export const EndedBookingsSection: React.FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { data: bookings } = useBookings(true)

  if (!bookings || !bookings.ended_bookings || bookings.ended_bookings.length === 0) {
    return <React.Fragment />
  }

  const { ended_bookings: endedBookings } = bookings

  const endedBookingsLabel = plural(endedBookings.length, {
    one: 'Réservation terminée',
    other: 'Réservations terminées',
  })

  return (
    <EndedBookingsSectionWrapper>
      <SectionRow
        type="navigable"
        title={endedBookingsLabel}
        icon={() => <Badge label={endedBookings.length} />}
        onPress={() => navigate('EndedBookings')}
        testID="row-ended-bookings"
      />
    </EndedBookingsSectionWrapper>
  )
}

const EndedBookingsSectionWrapper = styled.View({
  width: '100%',
  justifyContent: 'center',
})
