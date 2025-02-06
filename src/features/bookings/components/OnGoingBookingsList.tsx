import React, { FunctionComponent, useCallback, useMemo } from 'react'
import { FlatList, ListRenderItem, NativeScrollEvent } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { useBookings } from 'features/bookings/api'
import { EndedBookingsSection } from 'features/bookings/components/EndedBookingsSection'
import { getEligibleBookingsForArchive } from 'features/bookings/helpers/expirationDateUtils'
import { Booking } from 'features/bookings/types'
import { isCloseToBottom } from 'libs/analytics'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
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
import { getSpacing, Spacer, TypoDS } from 'ui/theme'
import { TAB_BAR_COMP_HEIGHT_V2 } from 'ui/theme/constants'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

import { NoBookingsView } from './NoBookingsView'
import { OnGoingBookingItem } from './OnGoingBookingItem'

const emptyBookings: Booking[] = []

const ANIMATION_DURATION = 700

export const OnGoingBookingsList: FunctionComponent = () => {
  const enableBookingImprove = useFeatureFlag(RemoteStoreFeatureFlags.WIP_BOOKING_IMPROVE)
  const netInfo = useNetInfoContext()
  const { data: bookings, isLoading, isFetching, refetch } = useBookings()
  const { isLoading: subcategoriesIsLoading } = useSubcategories()
  const showSkeleton = useIsFalseWithDelay(isLoading || subcategoriesIsLoading, ANIMATION_DURATION)
  const isRefreshing = useIsFalseWithDelay(isFetching, ANIMATION_DURATION)
  const { showErrorSnackBar } = useSnackBarContext()
  const {
    tabBar: { height },
  } = useTheme()

  const {
    ongoing_bookings: ongoingBookings = emptyBookings,
    ended_bookings: endedBookings = emptyBookings,
  } = bookings ?? {}

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
    singular: '# réservation en cours',
    plural: '# réservations en cours',
  })

  const ListHeaderComponent = useCallback(
    () => (hasBookings ? <BookingsCount>{bookingsCountLabel}</BookingsCount> : null),
    [hasBookings, bookingsCountLabel]
  )
  const ListFooterComponent = useCallback(
    () => (
      <FooterContainer safeBottom={height}>
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

  const eligibleBookingsForArchive = useMemo(
    () => getEligibleBookingsForArchive(ongoingBookings),
    [ongoingBookings]
  )

  const renderItem: ListRenderItem<Booking> = useCallback(
    ({ item }) => (
      <OnGoingBookingItem booking={item} eligibleBookingsForArchive={eligibleBookingsForArchive} />
    ),
    [eligibleBookingsForArchive]
  )

  if (showSkeleton) return <BookingsPlaceholder />

  return enableBookingImprove ? (
    <FlatList
      listAs="ul"
      itemAs="li"
      testID="OnGoingBookingsList"
      keyExtractor={keyExtractor}
      data={ongoingBookings}
      renderItem={renderItem}
      refreshing={isRefreshing}
      onRefresh={onRefetch}
      contentContainerStyle={contentContainerStyle}
      ListHeaderComponent={onGoingBookingsCount ? <Spacer.Column numberOfSpaces={6} /> : null}
      ListEmptyComponent={<NoBookingsView />}
      ItemSeparatorComponent={ItemSeparatorComponent}
      scrollEnabled={hasBookings}
      onScroll={onScroll}
      scrollEventThrottle={16}
    />
  ) : (
    <Container flex={hasBookings || hasEndedBookings ? 1 : undefined}>
      <FlatList
        listAs="ul"
        itemAs="li"
        testID="OnGoingBookingsList"
        keyExtractor={keyExtractor}
        data={ongoingBookings}
        renderItem={renderItem}
        refreshing={isRefreshing}
        onRefresh={onRefetch}
        contentContainerStyle={contentContainerStyle}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={<StyledNoBookingsView />}
        ListFooterComponent={ListFooterComponent}
        ItemSeparatorComponent={ItemSeparatorComponent}
        scrollEnabled={hasBookings}
        onScroll={onScroll}
        scrollEventThrottle={16}
      />
    </Container>
  )
}

const keyExtractor = (item: Booking) => item.id.toString()

const contentContainerStyle = {
  flexGrow: 1,
  paddingBottom: TAB_BAR_COMP_HEIGHT_V2 + getSpacing(8),
}

const Container = styled.View<{ flex?: number }>(({ flex }) => ({
  flex,
  height: '100%',
}))

const BookingsCount = styled(TypoDS.BodyAccentXs).attrs(() => getHeadingAttrs(2))(({ theme }) => ({
  paddingHorizontal: getSpacing(6),
  paddingBottom: getSpacing(4),
  color: theme.colors.greyDark,
}))

const StyledNoBookingsView = styled(NoBookingsView)({
  flex: 1,
})

const FooterContainer = styled.View<{ safeBottom: number }>(({ safeBottom }) => ({
  marginBottom: safeBottom ? safeBottom / 2 : 0,
  paddingVertical: getSpacing(4),
  paddingHorizontal: getSpacing(6),
}))

const Footer = styled.View({ height: TAB_BAR_COMP_HEIGHT_V2 + getSpacing(52) })
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
      <Separator.Horizontal />
    </ItemSeparatorContainer>
  )
}
