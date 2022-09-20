import { t } from '@lingui/macro'
import React, { useCallback } from 'react'
import { FlatList, ListRenderItem } from 'react-native'
import styled from 'styled-components/native'

import { useBookings } from 'features/bookings/api/queries'
import { EndedBookingItem } from 'features/bookings/components/EndedBookingItem'
import { Booking } from 'features/bookings/components/types'
import { plural } from 'libs/plural'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { Separator } from 'ui/components/Separator'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'
const renderItem: ListRenderItem<Booking> = ({ item }) => <EndedBookingItem booking={item} />
const keyExtractor: (item: Booking) => string = (item) => item.id.toString()

export const EndedBookings: React.FC = () => {
  const { data: bookings } = useBookings()

  const endedBookingsCount = bookings?.ended_bookings?.length || 0
  const endedBookingsLabel = plural(endedBookingsCount, {
    one: '# réservation terminée',
    other: '# réservations terminées',
  })

  const ListHeaderComponent = useCallback(
    () => (
      <React.Fragment>
        <Spacer.Column numberOfSpaces={18} />
        <EndedBookingsCount>{endedBookingsLabel}</EndedBookingsCount>
      </React.Fragment>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [endedBookingsCount]
  )

  return (
    <React.Fragment>
      <PageHeader title={t`Réservations terminées`} background="primary" withGoBackButton />
      <FlatList
        contentContainerStyle={contentContainerStyle}
        data={bookings?.ended_bookings || []}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={StyledSeparator}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
      />
    </React.Fragment>
  )
}

const EndedBookingsCount = styled(Typo.Body).attrs(getHeadingAttrs(2))(({ theme }) => ({
  color: theme.colors.greyDark,
  paddingBottom: getSpacing(5.5),
}))

const contentContainerStyle = { paddingHorizontal: getSpacing(5) }
const ListFooterComponent = () => <Spacer.Column numberOfSpaces={12} />
const StyledSeparator = styled(Separator)({ marginVertical: getSpacing(4) })
