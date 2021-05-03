import { plural } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { Badge } from 'ui/components/Badge'
import { SectionRow } from 'ui/components/SectionRow'
import { Separator } from 'ui/components/Separator'
import { Spacer } from 'ui/theme'

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
    <React.Fragment>
      <Separator />
      <Spacer.Column numberOfSpaces={4} />
      <EndedBookingsSectionWrapper>
        <SectionRow
          type="navigable"
          title={endedBookingsLabel}
          icon={() => <Badge label={endedBookings.length} />}
          onPress={() => navigate('EndedBookings')}
          testID="row-ended-bookings"
        />
      </EndedBookingsSectionWrapper>
    </React.Fragment>
  )
}

const EndedBookingsSectionWrapper = styled.View({
  width: '100%',
  justifyContent: 'center',
})
