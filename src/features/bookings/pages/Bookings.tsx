import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
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
    `${onGoingBookingsCount}\u00a0` + getBookingsCountLabel(onGoingBookingsCount > 1)

  const endedBookingsCount = bookings?.ended_bookings?.length || 0
  const endedBookingsLabel = getEndedBookingsCountLabel(endedBookingsCount > 1)

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

const getBookingsCountLabel = (plural: boolean) =>
  plural ? _(t`réservations en cours`) : _(t`réservation en cours`)

const getEndedBookingsCountLabel = (plural: boolean) =>
  plural ? _(t`Réservations terminées`) : _(t`Réservation terminée`)

const Container = styled.View({
  flex: 1,
  padding: getSpacing(4),
})

const BookingsCount = styled(Typo.Body).attrs({
  color: ColorsEnum.GREY_DARK,
})({
  fontSize: 15,
  paddingVertical: getSpacing(2),
})

const EndedBookingsSection = styled(Section)({
  bottom: TAB_BAR_COMP_HEIGHT + getSpacing(5),
})
