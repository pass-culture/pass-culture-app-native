import React, { useCallback } from 'react'
import { FlatList, ListRenderItem } from 'react-native'
import styled from 'styled-components/native'

import { useBookings } from 'features/bookings/api'
import { EndedBookingItem } from 'features/bookings/components/EndedBookingItem'
import { Booking } from 'features/bookings/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { plural } from 'libs/plural'
import { BlurHeader } from 'ui/components/headers/BlurHeader'
import {
  PageHeaderWithoutPlaceholder,
  useGetHeaderHeight,
} from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { Separator } from 'ui/components/Separator'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const renderItem: ListRenderItem<Booking> = ({ item }) => <EndedBookingItem booking={item} />
const keyExtractor: (item: Booking) => string = (item) => item.id.toString()

export const EndedBookings: React.FC = () => {
  const { data: bookings } = useBookings()
  const { goBack } = useGoBack(...getTabNavConfig('Bookings'))
  const headerHeight = useGetHeaderHeight()

  const endedBookingsCount = bookings?.ended_bookings?.length ?? 0
  const endedBookingsLabel = plural(endedBookingsCount, {
    singular: '# réservation terminée',
    plural: '# réservations terminées',
  })

  const ListHeaderComponent = useCallback(
    () => (
      <React.Fragment>
        <Placeholder height={headerHeight} />
        <Spacer.Column numberOfSpaces={6} />
        <EndedBookingsCount>{endedBookingsLabel}</EndedBookingsCount>
      </React.Fragment>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [endedBookingsCount]
  )

  return (
    <React.Fragment>
      <PageHeaderWithoutPlaceholder title="Réservations terminées" onGoBack={goBack} />
      <FlatList
        listAs="ul"
        itemAs="li"
        contentContainerStyle={contentContainerStyle}
        data={bookings?.ended_bookings ?? []}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={StyledSeparator}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
      />
      <BlurHeader height={headerHeight} />
    </React.Fragment>
  )
}

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))

const EndedBookingsCount = styled(Typo.Body).attrs(getHeadingAttrs(2))(({ theme }) => ({
  color: theme.colors.greyDark,
  paddingBottom: getSpacing(5.5),
}))

const contentContainerStyle = { paddingHorizontal: getSpacing(5) }
const ListFooterComponent = () => <Spacer.Column numberOfSpaces={12} />
const StyledSeparator = styled(Separator.Horizontal)({ marginVertical: getSpacing(4) })
