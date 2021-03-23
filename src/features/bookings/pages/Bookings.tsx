import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { i18n, _ } from 'libs/i18n'
import { Badge } from 'ui/components/Badge'
import SvgPageHeader from 'ui/components/headers/SvgPageHeader'
import { Section } from 'ui/components/Section'
import { SectionRow } from 'ui/components/SectionRow'
import { ColorsEnum, getSpacing, Spacer, TAB_BAR_COMP_HEIGHT, Typo } from 'ui/theme'

import { useBookings } from '../api'
import { NoBookingsView } from '../components/NoBookingsView'

export const Bookings: React.FC = () => {
  const { data: bookings } = useBookings()
  const { navigate } = useNavigation<UseNavigationType>()

  const onGoingBookingsCount = bookings?.ongoing_bookings?.length || 0
  const bookingsCountLabel =
    `${onGoingBookingsCount}\u00a0` +
    i18n.plural({
      value: onGoingBookingsCount,
      one: 'réservation en cours',
      other: 'réservations en cours',
    })

  const endedBookingsCount = bookings?.ended_bookings?.length || 0
  const endedBookingsLabel = i18n.plural({
    value: endedBookingsCount,
    one: 'Réservation terminée',
    other: 'Réservations terminées',
  })

  return (
    <React.Fragment>
      <SvgPageHeader title="Mes réservations" />
      <Container>
        {onGoingBookingsCount > 0 ? (
          <React.Fragment>
            <BookingsCount>{bookingsCountLabel}</BookingsCount>
            <Spacer.Flex />
          </React.Fragment>
        ) : (
          <NoBookingsView />
        )}
        {endedBookingsCount > 0 && (
          <EndedBookingsSection>
            <Spacer.Column numberOfSpaces={4} />
            <SectionRow
              type="navigable"
              title={endedBookingsLabel}
              icon={() => <Badge label={endedBookingsCount} />}
              onPress={() => navigate('EndedBookings')}
              testID="row-ended-bookings"
            />
          </EndedBookingsSection>
        )}
      </Container>
    </React.Fragment>
  )
}

const Container = styled.View({
  flex: 1,
  padding: getSpacing(4),
})

const BookingsCount = styled(Typo.Body).attrs({
  color: ColorsEnum.GREY_DARK,
})({
  paddingVertical: getSpacing(2),
})

const EndedBookingsSection = styled(Section)({
  bottom: TAB_BAR_COMP_HEIGHT + getSpacing(5),
})
