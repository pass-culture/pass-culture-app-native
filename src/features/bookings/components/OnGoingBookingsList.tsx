import React, { useCallback, useMemo } from 'react'
import { FlatList, ListRenderItem, NativeScrollEvent } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { useBookings } from 'features/bookings/api'
import { EndedBookingsSection } from 'features/bookings/pages/EndedBookingsSection'
import { Booking } from 'features/bookings/types'
import { analytics, isCloseToBottom } from 'libs/firebase/analytics'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { plural } from 'libs/plural'
import { useSubcategories } from 'libs/subcategories/useSubcategories'
import {
  BookingHitPlaceholder,
  NumberOfBookingsPlaceholder,
} from 'ui/components/placeholders/Placeholders'
import { Separator } from 'ui/components/Separator'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { getSpacing, Typo } from 'ui/theme'
import { TAB_BAR_COMP_HEIGHT } from 'ui/theme/constants'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

import { NoBookingsView } from './NoBookingsView'
import { OnGoingBookingItem } from './OnGoingBookingItem'

const emptyBookings: Booking[] = []

const ANIMATION_DURATION = 700

export function OnGoingBookingsList() {
  const netInfo = useNetInfoContext()
  const { data: bookings, isLoading, isFetching, refetch } = useBookings()
  const { bottom } = useSafeAreaInsets()
  const { isLoading: subcategoriesIsLoading } = useSubcategories()
  const showSkeleton = useIsFalseWithDelay(isLoading || subcategoriesIsLoading, ANIMATION_DURATION)
  const isRefreshing = useIsFalseWithDelay(isFetching, ANIMATION_DURATION)
  const { showErrorSnackBar } = useSnackBarContext()

  const {
    ongoing_bookings: ongoingBookings = emptyBookings,
    ended_bookings: endedBookings = emptyBookings,
  } = bookings || {}

  const refetchOffline = useCallback(() => {
    showErrorSnackBar({
      message: 'Impossible de recharger tes réservations, connecte-toi à internet pour réessayer.',
      timeout: SNACK_BAR_TIME_OUT,
    })
  }, [showErrorSnackBar])

  const onRefetch = netInfo.isConnected && netInfo.isInternetReachable ? refetch : refetchOffline
  const onGoingBookingsCount = ongoingBookings.length
  const hasBookings = onGoingBookingsCount > 0
  const hasEndedBookings = endedBookings.length > 0
  const bookingsCountLabel = plural(onGoingBookingsCount, {
    one: '# réservation en cours',
    other: '# réservations en cours',
  })

  const ListHeaderComponent = useCallback(
    () => (hasBookings ? <BookingsCount>{bookingsCountLabel}</BookingsCount> : null),
    [hasBookings, bookingsCountLabel]
  )
  const ListFooterComponent = useCallback(
    () => (
      <FooterContainer safeBottom={bottom}>
        <EndedBookingsSection endedBookings={endedBookings} />
      </FooterContainer>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasBookings, bookingsCountLabel, endedBookings]
  )

  const logBookingsScrolledToBottom = useFunctionOnce(analytics.logBookingsScrolledToBottom)

  function onScroll({ nativeEvent }: { nativeEvent: NativeScrollEvent }) {
    if (isCloseToBottom(nativeEvent)) {
      logBookingsScrolledToBottom()
    }
  }

  if (showSkeleton) return <BookingsPlaceholder />
  return (
    <Container flex={hasBookings || hasEndedBookings ? 1 : undefined}>
      <FlatList
        testID="OnGoingBookingsList"
        keyExtractor={keyExtractor}
        data={ongoingBookings}
        renderItem={renderItem}
        refreshing={isRefreshing}
        onRefresh={onRefetch}
        contentContainerStyle={contentContainerStyle}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={<NoBookingsView />}
        ListFooterComponent={ListFooterComponent}
        ItemSeparatorComponent={ItemSeparatorComponent}
        scrollEnabled={hasBookings}
        onScroll={onScroll}
        scrollEventThrottle={400}
      />
    </Container>
  )
}

const keyExtractor = (item: Booking) => item.id.toString()

const renderItem: ListRenderItem<Booking> = ({ item }) => <OnGoingBookingItem booking={item} />

const contentContainerStyle = {
  flexGrow: 1,
  paddingBottom: TAB_BAR_COMP_HEIGHT + getSpacing(2),
}

const Container = styled.View<{ flex?: number }>(({ flex }) => ({
  flex,
  height: '100%',
}))

const BookingsCount = styled(Typo.Body).attrs(() => getHeadingAttrs(2))(({ theme }) => ({
  paddingTop: getSpacing(2),
  paddingHorizontal: getSpacing(6),
  paddingBottom: getSpacing(4),
  color: theme.colors.greyDark,
}))

const FooterContainer = styled.View<{ safeBottom: number }>(({ safeBottom }) => ({
  marginBottom: safeBottom ? safeBottom / 2 : 0,
  paddingVertical: getSpacing(4),
  paddingHorizontal: getSpacing(6),
}))

const Footer = styled.View({ height: TAB_BAR_COMP_HEIGHT + getSpacing(52) })
const BOOKINGS_LIST_PLACEHOLDER = Array.from({ length: 10 }).map((_, index) => ({
  key: index.toString(),
}))

function BookingsPlaceholder() {
  const renderPlaceholder = useCallback(() => <BookingHitPlaceholder />, [])
  const ListHeaderComponent = useMemo(() => <NumberOfBookingsPlaceholder />, [])
  const ListFooterComponent = useMemo(() => <Footer />, [])

  return (
    <LoadingContainer testID="BookingsPlaceholder">
      <FlatList
        data={BOOKINGS_LIST_PLACEHOLDER}
        renderItem={renderPlaceholder}
        contentContainerStyle={contentContainerStyle}
        ListHeaderComponent={ListHeaderComponent}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ListFooterComponent={ListFooterComponent}
        scrollEnabled={false}
      />
    </LoadingContainer>
  )
}
const LoadingContainer = styled.View({ flex: 1 })

const ItemSeparatorContainer = styled.View({
  marginHorizontal: getSpacing(6),
  marginVertical: getSpacing(4),
})
function ItemSeparatorComponent() {
  return (
    <ItemSeparatorContainer>
      <Separator />
    </ItemSeparatorContainer>
  )
}
