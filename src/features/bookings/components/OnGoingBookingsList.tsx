import { UseQueryResult } from '@tanstack/react-query'
import React, { FunctionComponent, useCallback, useMemo } from 'react'
import { FlatList, ListRenderItem, NativeScrollEvent } from 'react-native'
import styled from 'styled-components/native'

import { BookingListItemResponse, BookingsListResponseV2 } from 'api/gen'
import { OngoingBookingListItemWrapper } from 'features/bookings/components/OngoingBookingListItemWrapper'
import { expirationDateUtilsV2 } from 'features/bookings/helpers'
import { isCloseToBottom } from 'libs/analytics'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { useSubcategoriesQuery } from 'queries/subcategories/useSubcategoriesQuery'
import {
  BookingHitPlaceholder,
  NumberOfBookingsPlaceholder,
} from 'ui/components/placeholders/Placeholders'
import { Separator } from 'ui/components/Separator'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { getSpacing, Spacer } from 'ui/theme'
import { TAB_BAR_COMP_HEIGHT_V2 } from 'ui/theme/constants'

import { NoBookingsView } from './NoBookingsView'
import { OnGoingBookingItem } from './OnGoingBookingItem'

const ANIMATION_DURATION = 700

type Props = {
  useOngoingBookingsQuery: () => UseQueryResult<BookingsListResponseV2, Error>
}

export const OnGoingBookingsList: FunctionComponent<Props> = ({ useOngoingBookingsQuery }) => {
  const netInfo = useNetInfoContext()

  const enableNewBookings = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_BOOKINGS_ENDED_ONGOING)

  const {
    data: bookings = { bookings: [] },
    isLoading,
    isFetching,
    refetch,
  } = useOngoingBookingsQuery()
  const { bookings: ongoingBookings } = bookings

  const { isLoading: subcategoriesIsLoading } = useSubcategoriesQuery()
  const showSkeleton = useIsFalseWithDelay(isLoading || subcategoriesIsLoading, ANIMATION_DURATION)
  const isRefreshing = useIsFalseWithDelay(isFetching, ANIMATION_DURATION)
  const { showErrorSnackBar } = useSnackBarContext()

  const refetchOffline = useCallback(() => {
    showErrorSnackBar({
      message: 'Impossible de recharger tes réservations, connecte-toi à internet pour réessayer.',
      timeout: SNACK_BAR_TIME_OUT,
    })
  }, [showErrorSnackBar])

  const onRefetch = netInfo.isConnected && netInfo.isInternetReachable ? refetch : refetchOffline
  const hasBookings = ongoingBookings.length > 0

  const logBookingsScrolledToBottom = useFunctionOnce(analytics.logBookingsScrolledToBottom)

  function onScroll({ nativeEvent }: { nativeEvent: NativeScrollEvent }) {
    if (isCloseToBottom(nativeEvent)) {
      logBookingsScrolledToBottom()
    }
  }

  const eligibleBookingsForArchive =
    expirationDateUtilsV2.getEligibleBookingsForArchive(ongoingBookings)

  if (showSkeleton) return <BookingsPlaceholder />

  const renderItem: ListRenderItem<BookingListItemResponse> = ({ item }) => {
    return enableNewBookings ? (
      <OngoingBookingListItemWrapper
        booking={item}
        eligibleBookingsForArchive={eligibleBookingsForArchive}
      />
    ) : (
      <OnGoingBookingItem booking={item} eligibleBookingsForArchive={eligibleBookingsForArchive} />
    )
  }

  return (
    <FlatList
      testID="OnGoingBookingsList"
      keyExtractor={keyExtractor}
      data={ongoingBookings}
      renderItem={renderItem}
      refreshing={isRefreshing}
      onRefresh={onRefetch}
      contentContainerStyle={contentContainerStyle}
      ListHeaderComponent={hasBookings ? <Spacer.Column numberOfSpaces={6} /> : null}
      ListEmptyComponent={<NoBookingsView />}
      ItemSeparatorComponent={enableNewBookings ? null : ItemSeparatorComponent}
      onScroll={onScroll}
      scrollEventThrottle={16}
    />
  )
}

const keyExtractor = (item: BookingListItemResponse) => item.id.toString()

const contentContainerStyle = {
  flexGrow: 1,
  paddingBottom: TAB_BAR_COMP_HEIGHT_V2 + getSpacing(8),
}

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

const ItemSeparatorContainer = styled.View(({ theme }) => ({
  marginHorizontal: theme.designSystem.size.spacing.xl,
  marginVertical: theme.designSystem.size.spacing.l,
}))

const ItemSeparatorComponent = () => {
  return (
    <ItemSeparatorContainer>
      <Separator.Horizontal />
    </ItemSeparatorContainer>
  )
}
