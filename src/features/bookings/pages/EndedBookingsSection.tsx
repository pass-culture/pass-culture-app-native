import { plural } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { StyleSheet } from 'react-native'
import styled from 'styled-components/native'

import { Booking } from 'features/bookings/components/types'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { Badge } from 'ui/components/Badge'
import { SectionRow } from 'ui/components/SectionRow'
import { Separator } from 'ui/components/Separator'
import { Spacer } from 'ui/theme'
import { Link } from 'ui/web/link/Link'

export const EndedBookingsSection: React.FC<{ endedBookings?: Booking[] }> = (props) => {
  const { navigate } = useNavigation<UseNavigationType>()
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
        <Link
          to={{ screen: 'EndedBookings', params: undefined }}
          style={styles.link}
          accessible={false}>
          <SectionRow
            type="navigable"
            title={endedBookingsLabel}
            icon={() => <Badge label={endedBookings.length} />}
            onPress={() => navigate('EndedBookings')}
          />
        </Link>
      </EndedBookingsSectionWrapper>
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  link: {
    flexDirection: 'column',
    display: 'flex',
  },
})

const EndedBookingsSectionWrapper = styled.View({
  width: '100%',
  justifyContent: 'center',
})
