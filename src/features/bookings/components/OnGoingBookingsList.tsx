import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FlatList, ListRenderItem, NativeScrollEvent } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { useBookings } from 'features/bookings/api'
import { EndedBookingsSection } from 'features/bookings/components/EndedBookingsSection'
import { getEligibleBookingsForArchive } from 'features/bookings/helpers/expirationDateUtils'
import { Booking, RideResponseType } from 'features/bookings/types'
import { analytics, isCloseToBottom } from 'libs/analytics'
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
import { RideBookingItem } from 'features/bookings/components/RideBookingItem'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { api } from 'api/api'

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
  const [reservedRides, setReserveRides] = useState([])

  const {
    ongoing_bookings: ongoingBookings = emptyBookings,
    ended_bookings: endedBookings = emptyBookings,
  } = bookings ?? {}

  const storeReservation = async (reservation) => {
    try {
      const reservationsJSON = await AsyncStorage.getItem('reservations')
      let reservations = []

      if (reservationsJSON !== null) {
        reservations = JSON.parse(reservationsJSON)
      }

      reservations.push(reservation)

      const updatedReservationsJSON = JSON.stringify(reservations)
      await AsyncStorage.setItem('reservations', updatedReservationsJSON)

      console.log('Reservation stored successfully.', updatedReservationsJSON)
    } catch (error) {
      console.log('Error storing reservation:', error)
    }
  }

  const getReservationsByCommonKey = async (commonKey) => {
    try {
      const reservationsJSON = await AsyncStorage.getItem('reservations')

      if (reservationsJSON !== null) {
        const reservations = JSON.parse(reservationsJSON)
        const filteredReservations = reservations.filter(
          (reservation) => reservation.commonKey === commonKey
        )

        console.log('Retrieved reservations:', filteredReservations)
        return filteredReservations
      } else {
        console.log('No reservations found.')
        return []
      }
    } catch (error) {
      console.log('Error retrieving reservations:', error)
      return []
    }
  }

  useEffect(() => {
    async function getridedata() {
      const { phoneNumber } = (await api.getnativev1me()) || '+919480081411'
      let mobile = phoneNumber?.slice(3, phoneNumber.length)

      // await storeReservation({
      //   reservationid: 5,
      //   tripid: 'dcbb7f15-49b6-4eac-90b8-4de8da9581b6',
      //   tripamount: 13,
      //   source: { lat: 13.0411, lon: 77.6622, name: 'Horamavu agara' },
      //   destination: { lat: 13.0335, lon: 77.6739, name: 'Kalkere' },
      //   tripdate: '2023-07-02T06:53:15.622Z',
      //   commonKey: mobile,
      // })

      const rideData = await getReservationsByCommonKey(mobile)
      setReserveRides(rideData)
    }
    getridedata()
  }, [])

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

  const eligibleBookingsForArchive = useMemo(
    () => getEligibleBookingsForArchive(ongoingBookings),
    [ongoingBookings]
  )

  const renderItem: ListRenderItem<any> = useCallback(
    ({ item }) =>
      item.reservationid ? (
        <RideBookingItem booking={item} />
      ) : (
        <OnGoingBookingItem
          booking={item}
          eligibleBookingsForArchive={eligibleBookingsForArchive}
        />
      ),
    [eligibleBookingsForArchive]
  )
  //
  if (showSkeleton) return <BookingsPlaceholder />
  return (
    <Container flex={hasBookings || hasEndedBookings ? 1 : undefined}>
      <FlatList
        listAs="ul"
        itemAs="li"
        testID="OnGoingBookingsList"
        keyExtractor={keyExtractor}
        data={[...ongoingBookings, ...reservedRides]}
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

const keyExtractor = (item: Booking | RideResponseType) =>
  item?.id?.toString() || item?.reservationid?.toString()

const contentContainerStyle = {
  flexGrow: 1,
  paddingBottom: TAB_BAR_COMP_HEIGHT + getSpacing(2),
}

const Container = styled.View<{ flex?: number }>(({ flex }) => ({
  flex,
  height: '100%',
}))

const BookingsCount = styled(Typo.Body).attrs(() => getHeadingAttrs(2))(({ theme }) => ({
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
