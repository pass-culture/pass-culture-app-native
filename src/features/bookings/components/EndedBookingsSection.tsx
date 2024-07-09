import React from 'react'
import styled from 'styled-components/native'

import { Booking } from 'features/bookings/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { plural } from 'libs/plural'
import { Badge } from 'ui/components/Badge'
import { SectionRow } from 'ui/components/SectionRow'
import { Separator } from 'ui/components/Separator'
import { Spacer } from 'ui/theme'

export const EndedBookingsSection: React.FC<{ endedBookings?: Booking[] }> = (props) => {
  const { endedBookings } = props
  const enableBookingImprove = useFeatureFlag(RemoteStoreFeatureFlags.WIP_BOOKING_IMPROVE)

  if (!endedBookings || endedBookings.length === 0) {
    return null
  }

  const endedBookingsLabel = plural(endedBookings.length, {
    singular: 'Réservation terminée',
    plural: 'Réservations terminées',
  })

  const renderBadge = () => <Badge value={endedBookings.length} />

  return (
    <React.Fragment>
      <Separator.Horizontal />
      <Spacer.Column numberOfSpaces={4} />
      <EndedBookingsSectionWrapper>
        <SectionRow
          type="navigable"
          title={endedBookingsLabel}
          icon={renderBadge}
          navigateTo={{ screen: enableBookingImprove ? 'Bookings' : 'EndedBookings' }}
        />
      </EndedBookingsSectionWrapper>
    </React.Fragment>
  )
}

const EndedBookingsSectionWrapper = styled.View({
  width: '100%',
  justifyContent: 'center',
})
