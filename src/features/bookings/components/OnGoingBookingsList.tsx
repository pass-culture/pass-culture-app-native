import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  FlatList,
  ListRenderItem,
  NativeScrollEvent,
  NativeModules,
  NativeEventEmitter,
  BackHandler,
} from 'react-native'
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
import HyperSdkReact from 'hyper-sdk-react'

const emptyBookings: Booking[] = []

const ANIMATION_DURATION = 700
HyperSdkReact.createHyperServices()

interface Location {
  latitude: number
  longitude: number
}
const { HyperSDKModule } = NativeModules

export function OnGoingBookingsList() {
  const netInfo = useNetInfoContext()
  const { data: bookings, isLoading, isFetching, refetch } = useBookings()
  const { bottom } = useSafeAreaInsets()
  const { isLoading: subcategoriesIsLoading } = useSubcategories()
  const showSkeleton = useIsFalseWithDelay(isLoading || subcategoriesIsLoading, ANIMATION_DURATION)
  const isRefreshing = useIsFalseWithDelay(isFetching, ANIMATION_DURATION)
  const { showErrorSnackBar } = useSnackBarContext()
  const [mobileNumber, setMobileNumber] = useState()

  const [reservedRides, setReserveRides] = useState([
    {
      commonKey: '600000341',
      destination: { lat: 48.8606, lon: 2.3376, name: 'louvre museum paris' },
      reservationid: 31620150,
      source: { lat: 48.855167228334196, lon: 2.295221909880638, name: 'Paris, France' },
      tripamount: 11,
      tripdate: '2023-07-02T16:12:27.050Z',
      tripid: '585b1987-8b9b-4253-b688-21dda5af9a9d',
    },
  ])

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

  const initiatePayload = JSON.stringify({
    // Replace with your initiate payload
    requestId: '6bdee986-f106-4884-ba9a-99c478d78c22',
    service: 'in.yatri.consumer',
    payload: {
      clientId: 'passcultureconsumer',
      merchantId: 'passcultureconsumer',
      action: 'initiate',
      environment: 'master',
      service: 'in.yatri.consumer',
    },
  })
  const [currentLocation, setCurrentLocation] = useState<Location | null>({
    latitude: 48.8566,
    longitude: 2.3522,
  })

  const processPayload2 = {
    requestId: '6bdee986-f106-4884-ba9a-99c478d78c22',
    service: 'in.yatri.consumer',
    payload: {
      clientId: 'passcultureconsumer',
      merchantId: 'passcultureconsumer',
      action: 'initiate',
      service: 'in.yatri.consumer',
      environment: 'master',
      signatureAuthData: {
        signature: '',
        authData: '',
      },
      search_type: 'direct_search',
      source: {
        lat: currentLocation?.latitude,
        lon: currentLocation?.longitude,
        name: 'Paris, France',
      },
      destination: {
        lat: 48.8606,
        lon: 2.3376,
        name: 'Louvre Museum Paris France',
      },
    },
  }

  const handleClick = () => {
    if (HyperSdkReact.isNull()) {
      HyperSdkReact.createHyperServices()
    }

    HyperSdkReact.initiate(initiatePayload)
    HyperSdkReact.isInitialised().then((init) => {
      console.log('isInitialised:', init)
    })
  }

  const [signatureResponse, setSignatureResponse] = useState(null) // State to store the signature response

  useEffect(() => {
    const fetchSignatureResponse = async () => {
      const { firstName } = (await api.getnativev1me()) || 'user'
      const { phoneNumber } = (await api.getnativev1me()) || '+918297921333'
      let mobile = phoneNumber?.slice(3, phoneNumber.length)
      console.log('test username1', mobile, firstName)
      setMobileNumber(mobile)
      try {
        const result = await HyperSDKModule.dynamicSign(firstName, mobile, mobileCountryCode)
        setSignatureResponse(result)
        console.log('signauth check', result)
      } catch (error) {
        console.error(error)
      }
    }

    fetchSignatureResponse()
  }, [])

  useEffect(() => {
    const processPayload2Copy = { ...processPayload2 } // Create a copy of the processPayload2 object

    if (signatureResponse) {
      processPayload2Copy.payload.signatureAuthData.signature = signatureResponse.signature
      processPayload2Copy.payload.signatureAuthData.authData = signatureResponse.signatureAuthData
    }
    console.log('Updated processPayload2:', processPayload2Copy)

    const eventEmitter = new NativeEventEmitter(NativeModules.HyperSdkReact)
    const eventListener = eventEmitter.addListener('HyperEvent', (resp) => {
      const data = JSON.parse(resp)
      const event = data.event || ''
      console.log('event_call: is called ', event)
      switch (event) {
        case 'show_loader':
          // show some loader here
          break

        case 'hide_loader':
          // hide the loader
          break

        case 'initiate_result':
          const payload = data.payload || {}
          const res = payload ? payload.status : payload
          console.log('initiate_result: ', processPayload2)
          if (res === 'SUCCESS') {
            // Initiation is successful, call process method
            if (processPayload2.payload.signatureAuthData != undefined) {
              HyperSdkReact.process(JSON.stringify(processPayload2))
            } else {
              alert('Invalid signature')
            }
            // HyperSdkReact.process(JSON.stringify(processPayload2));
            console.log('process_call: is called ', payload)
          } else {
            // Handle initiation failure
            console.log('Initiation failed.')
          }
          break

        case 'process_result':
          const processPayload = data.payload || {}
          console.log('process_result: ', processPayload)
          // Handle process result
          if (processPayload?.action === 'terminate' && processPayload?.screen === 'home_screen') {
            HyperSdkReact.terminate()
            console.log('process_call: is called ', processPayload)
          } else if (processPayload?.action === 'trip_completed') {
            //function call for wallet transaction
            const reservation1 = {
              reservationid: '345859',
              tripid: processPayload?.trip_id,
              tripamount: processPayload?.trip_amount,
              source: processPayload2.payload.source,
              destination: processPayload2.payload.destination,
              tripdate: new Date(),
              commonKey: mobileNumber,
            }
            storeReservation(reservation1)
            console.log('process_call: wallet transaction ', processPayload)
            // HyperSdkReact.terminate();
          } else if (
            processPayload?.action === 'feedback_submitted' ||
            processPayload?.action === 'home_screen'
          ) {
            console.log('process_call: wallet transaction ', processPayload)
            HyperSdkReact.terminate()
          }

          if (processPayload?.screen === 'home_screen') {
            HyperSdkReact.terminate()
          } else if (processPayload?.screen === 'trip_started_screen') {
            BackHandler.exitApp()
          }
          console.log('process_call: process ', processPayload)

          break

        default:
          console.log('Unknown Event', data)
      }
    })

    BackHandler.addEventListener('hardwareBackPress', () => {
      return !HyperSdkReact.isNull() && HyperSdkReact.onBackPressed()
    })

    return () => {
      eventListener.remove()
      BackHandler.removeEventListener('hardwareBackPress', () => null)
    }
  }, [signatureResponse])

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
        <RideBookingItem booking={item} onRideClick={handleClick} />
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
