import React from 'react'
import styled from 'styled-components/native'

import { Booking } from 'features/bookings/types'
import { plural } from 'libs/plural'
import { Badge } from 'ui/components/Badge'
import { SectionRow } from 'ui/components/SectionRow'
import { Separator } from 'ui/components/Separator'
import { Spacer } from 'ui/theme'

export const EndedBookingsSection: React.FC<{ endedBookings?: Booking[] }> = (props) => {
  const { endedBookings } = props

  if (!endedBookings || endedBookings.length === 0) {
    return <React.Fragment />
  }

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
          icon={() => <Badge value={endedBookings.length} />}
          navigateTo={{ screen: 'EndedBookings' }}
        />
      </EndedBookingsSectionWrapper>
    </React.Fragment>
  )
}

const EndedBookingsSectionWrapper = styled.View({
  width: '100%',
  justifyContent: 'center',
})
