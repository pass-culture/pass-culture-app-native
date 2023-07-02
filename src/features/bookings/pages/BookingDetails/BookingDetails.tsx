import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'
import { Platform, ScrollView, useWindowDimensions, NativeModules, NativeEventEmitter, BackHandler } from 'react-native'
import { useQueryClient } from 'react-query'
import styled from 'styled-components/native'

import { useBookings, useOngoingOrEndedBooking } from 'features/bookings/api'
import { ArchiveBookingModal } from 'features/bookings/components/ArchiveBookingModal'
import { BookingDetailsCancelButton } from 'features/bookings/components/BookingDetailsCancelButton'
import { BookingDetailsHeader } from 'features/bookings/components/BookingDetailsHeader'
import { BookingPropertiesSection } from 'features/bookings/components/BookingPropertiesSection'
import { CancelBookingModal } from 'features/bookings/components/CancelBookingModal'
import { TicketSwiper } from 'features/bookings/components/Ticket/TicketSwiper'
import { getBookingProperties, getOfferRules } from 'features/bookings/helpers'
import { isEligibleBookingsForArchive } from 'features/bookings/helpers/expirationDateUtils'
import { BookingNotFound } from 'features/bookings/pages/BookingNotFound/BookingNotFound'
import { Booking } from 'features/bookings/types'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { mergeOfferData } from 'features/offer/components/OfferTile/OfferTile'
import { formatFullAddress } from 'libs/address/useFormatFullAddress'
import { analytics, isCloseToBottom } from 'libs/analytics'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { SeeItineraryButton } from 'libs/itinerary/components/SeeItineraryButton'
import { getGoogleMapsItineraryUrl } from 'libs/itinerary/openGoogleMapsItinerary'
import { eventMonitoring, ScreenError } from 'libs/monitoring'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { HeroHeader } from 'ui/components/hero/HeroHeader'
import { blurImageHeight, heroMarginTop } from 'ui/components/hero/useHeroDimensions'
import { LoadingPage } from 'ui/components/LoadingPage'
import { useModal } from 'ui/components/modals/useModal'
import { Separator } from 'ui/components/Separator'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'
import { Helmet } from 'ui/web/global/Helmet'
import HyperSdkReact from 'hyper-sdk-react'
import { api } from 'api/api'

//sdk specific
HyperSdkReact.createHyperServices()
const { HyperSDKModule } = NativeModules;
//sdk specific endpoint

const scrollIndicatorInsets = { right: 1 }
const emptyBookings: Booking[] = []

export function BookingDetails() {

  const windowHeight = useWindowDimensions().height - blurImageHeight
  const netInfo = useNetInfoContext()
  const { params } = useRoute<UseRouteType<'BookingDetails'>>()
  const {
    status,
    data: booking,
    isLoading,
    isError,
    error,
    dataUpdatedAt,
  } = useOngoingOrEndedBooking(params.id)

  const queryClient = useQueryClient()
  const { visible: cancelModalVisible, showModal: showCancelModal, hideModal } = useModal(false)
  const {
    visible: archiveModalVisible,
    showModal: showArchiveModal,
    hideModal: hideArchiveModal,
  } = useModal(false)

  const mapping = useSubcategoriesMapping()

  const { venue, id: offerId } = booking?.stock.offer ?? {}
  const { address, postalCode, city } = venue ?? {}
  const venueFullAddress = address ? formatFullAddress(address, postalCode, city) : undefined

  const { data: bookings } = useBookings()
  const { ended_bookings: endedBookings = emptyBookings } = bookings ?? {}
  const { showInfoSnackBar, showErrorSnackBar } = useSnackBarContext()

  const { navigate } = useNavigation<UseNavigationType>()

  // Allows to display a message in case of refresh specifying the cancellation
  // of the reservation being consulted if it is made via Flask Admin
  // and booking is not archived
  const cancellationConsultedBooking = endedBookings.filter(
    (item) => item.id === params.id && !isEligibleBookingsForArchive(item)
  )

  if (cancellationConsultedBooking.length > 0) {
    const nameCanceledBooking = cancellationConsultedBooking[0].stock.offer.name
    showInfoSnackBar({
      message: `Ta réservation "${nameCanceledBooking}" a été annulée`,
      timeout: SNACK_BAR_TIME_OUT,
    })
    navigate('EndedBookings')
  }

  const logConsultWholeBooking = useFunctionOnce(
    () => offerId && analytics.logBookingDetailsScrolledToBottom(offerId)
  )

  const { headerTransition, onScroll } = useOpacityTransition({
    listener: ({ nativeEvent }) => {
      if (isCloseToBottom(nativeEvent)) logConsultWholeBooking()
    },
  })

  if ((isLoading || !dataUpdatedAt) && !booking) {
    return <LoadingPage />
  } else if (!isLoading && !booking) {
    if (Platform.OS !== 'web') {
      const bookingNotFoundError = new Error('BookingNotFound')
      bookingNotFoundError.name = 'BookingNotFound'
      eventMonitoring.captureException(bookingNotFoundError, {
        extra: {
          status,
          isLoading,
          booking,
          dataUpdatedAt,
        },
      })
    }
    throw new ScreenError(`Booking #${params.id} not found`, BookingNotFound)
  } else if (isError) {
    throw error
  } else if (!booking) {
    // dead code to satisfy typescript Web compilation
    return null
  }

  const { offer } = booking.stock
  const properties = getBookingProperties(booking, mapping[offer.subcategoryId].isEvent)
  const shouldDisplayItineraryButton =
    !!venueFullAddress && (properties.isEvent || (properties.isPhysical && !properties.isDigital))

  const offerRules = getOfferRules(properties, booking)

  const cancelBooking = () => {
    showCancelModal()
    analytics.logCancelBooking(offer.id)
  }

  const onNavigateToOfferPress = () => {
    if (netInfo.isConnected) {
      queryClient.setQueryData(
        [QueryKeys.OFFER, offer.id],
        mergeOfferData({
          ...offer,
          categoryId: mapping[offer.subcategoryId].categoryId,
          thumbUrl: offer.image?.url,
          name: offer.name,
          offerId: offer.id,
        })
      )
      analytics.logConsultOffer({ offerId: offer.id, from: 'bookings' })
    } else {
      showErrorSnackBar({
        message:
          'Impossible d’afficher le détail de l’offre. Connecte-toi à internet avant de réessayer.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    }
  }


  const storeReservation = async (reservation) => {
    try {
      const reservationsJSON = await AsyncStorage.getItem('reservations');
      let reservations = [];

      if (reservationsJSON !== null) {
        reservations = JSON.parse(reservationsJSON);
      }

      reservations.push(reservation);

      const updatedReservationsJSON = JSON.stringify(reservations);
      await AsyncStorage.setItem('reservations', updatedReservationsJSON);

      console.log('Reservation stored successfully.', updatedReservationsJSON);
    } catch (error) {
      console.log('Error storing reservation:', error);
    }
  };


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
  const processPayload2 = {

    "requestId": "6bdee986-f106-4884-ba9a-99c478d78c22",
    "service": 'in.yatri.consumer',
    "payload": {
      "clientId": 'passcultureconsumer',
      "merchantId": 'passcultureconsumer',
      "action": 'initiate',
      "service": 'in.yatri.consumer',
      "environment": 'master',
      "signatureAuthData": {
        "signature": '',
        "authData": '',
      },
      "search_type": "direct_search",
      "source": {
        "lat": 13.0411,
        "lon": 77.6622,
        "name": "Horamavu agara"
      },
      "destination": {
        "lat": 13.0335,
        "lon": 77.6739,
        "name": "Kalkere"
      }
    }
  }


  const [mobileNumber, setMobileNumber] = useState();
  const mobileCountryCode = "+91";
  // const merchantId = "MOBILITY_PASSCULTURE";
  // const timestamp = "2023-04-13T07:28:40+00:00";
  // const userName = "Rajesh";
  const { bookingId } = booking.id

  const [signatureResponse, setSignatureResponse] = useState(null); // State to store the signature response

  useEffect(() => {
    const fetchSignatureResponse = async () => {
      const { firstName } = await api.getnativev1me() || 'user'
      const { phoneNumber } = (await api.getnativev1me()) || '+919480081411'
      let mobile = phoneNumber?.slice(3, phoneNumber.length)
      console.log("test username1", mobile, firstName)
      setMobileNumber(mobile);
      try {
        const result = await HyperSDKModule.dynamicSign(firstName, '9347462929', mobileCountryCode);
        setSignatureResponse(result);
        console.log("signauth check", result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSignatureResponse();
  }, []);


  useEffect(() => {

    const processPayload2Copy = { ...processPayload2 }; // Create a copy of the processPayload2 object

    if (signatureResponse) {
      processPayload2Copy.payload.signatureAuthData.signature = signatureResponse.signature;
      processPayload2Copy.payload.signatureAuthData.authData = signatureResponse.signatureAuthData;

    }
    console.log('Updated processPayload2:', processPayload2Copy);


    const eventEmitter = new NativeEventEmitter(NativeModules.HyperSdkReact);
    const eventListener = eventEmitter.addListener('HyperEvent', (resp) => {
      const data = JSON.parse(resp);
      const event = data.event || '';
      console.log('event_call: is called ', event);
      switch (event) {
        case 'show_loader':
          // show some loader here
          break;

        case 'hide_loader':
          // hide the loader
          break;

        case 'initiate_result':
          const payload = data.payload || {};
          const res = payload ? payload.status : payload;
          console.log('initiate_result: ', processPayload2);
          if (res === 'SUCCESS') {
            // setModalVisible(false)
            // Initiation is successful, call process method
            if (processPayload2.payload.signatureAuthData != undefined) {
              HyperSdkReact.process(JSON.stringify(processPayload2));
            } else {
              alert('Invalid signature');
            }
            // HyperSdkReact.process(JSON.stringify(processPayload2));
            console.log('process_call: is called ', payload);
          } else {
            // Handle initiation failure
            // setModalVisible(true)
            console.log('Initiation failed.');
          }
          break;



        case 'process_result':
          const processPayload = data.payload || {};
          console.log('process_result: ', processPayload);
          // Handle process result
          if (processPayload?.action === 'terminate' && processPayload?.screen === 'home_screen') {
            HyperSdkReact.terminate();
            // console.log('process_call: is called ', processPayload);

          } else if (processPayload?.action === 'trip_completed') {
            //function call for wallet transaction
            const reservation1 = {
              reservationid: bookingId,
              tripid: processPayload?.trip_id,
              tripamount: processPayload?.trip_amount,
              source: processPayload2.payload.source,
              destination: processPayload2.payload.destination,
              tripdate: new Date(),
              commonKey: mobileNumber,
            };
            storeReservation(reservation1);
            console.log('process_call: wallet transaction ', processPayload);
            // HyperSdkReact.terminate();
          } else if (processPayload?.action === 'feedback_submitted' || processPayload?.action === 'home_screen') {

            console.log('process_call: wallet transaction ', processPayload);
            HyperSdkReact.terminate();
            // setModalVisible(true)
          }


          if (processPayload?.screen === 'home_screen') {
            HyperSdkReact.terminate();
            // setModalVisible(true)
          } else if (processPayload?.screen === 'trip_started_screen') {
            BackHandler.exitApp();
          }
          console.log('process_call: process ', processPayload);


          break;

        default:
          console.log('Unknown Event', data);
      }
    });

    BackHandler.addEventListener('hardwareBackPress', () => {
      return !HyperSdkReact.isNull() && HyperSdkReact.onBackPressed();
    });

    return () => {

      eventListener.remove();
      BackHandler.removeEventListener('hardwareBackPress', () => null);
    };
  }, [signatureResponse]);


  const viewTripDetails = () => {
    console.log('ACTION: View trip clicked')
    if (HyperSdkReact.isNull()) {
      HyperSdkReact.createHyperServices();
    }

    HyperSdkReact.initiate(initiatePayload);
    HyperSdkReact.isInitialised().then((init) => {
      console.log('isInitialised:', init);
    });
  }

  const helmetTitle = `Ma réservation pour ${booking.stock.offer.name} | pass Culture`
  return (
    <Container>
      <Helmet title={helmetTitle} />
      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={20}
        scrollIndicatorInsets={scrollIndicatorInsets}
        onContentSizeChange={(_w: number, h: number) => {
          if (h <= windowHeight) {
            logConsultWholeBooking()
          }
        }}
        testID="BookingDetailsScrollView"
        bounces={false}>
        <HeroHeader type="offer" imageHeight={blurImageHeight} imageUrl={offer.image?.url} />
        <Spacer.Column numberOfSpaces={heroMarginTop} />
        <TicketSwiper booking={booking} />
        <ViewWithPadding>
          <Spacer.Column numberOfSpaces={4} />
          <OfferRules>{offerRules}</OfferRules>
          <Spacer.Column numberOfSpaces={offerRules !== '' ? 8 : 2} />
          <BookingPropertiesSection booking={booking} />
          {!!shouldDisplayItineraryButton && (
            <React.Fragment>
              <Spacer.Column numberOfSpaces={4} />
              <Separator />
              <Spacer.Column numberOfSpaces={4} />
              <SeeItineraryButton
                externalNav={{
                  url: getGoogleMapsItineraryUrl(venueFullAddress),
                  address: venueFullAddress,
                }}
                onPress={() =>
                  offerId && analytics.logConsultItinerary({ offerId, from: 'bookingdetails' })
                }
              />
            </React.Fragment>
          )}
          {!!offer.withdrawalDetails && (
            <React.Fragment>
              <Spacer.Column numberOfSpaces={8} />
              <Typo.Title4 {...getHeadingAttrs(2)}>Modalités de retrait</Typo.Title4>
              <Spacer.Column numberOfSpaces={4} />
              <Typo.Body testID="withdrawalDetails">{offer.withdrawalDetails}</Typo.Body>
            </React.Fragment>
          )}
          <Spacer.Column numberOfSpaces={8} />
          <InternalTouchableLink
            enableNavigate={!!netInfo.isConnected}
            as={ButtonPrimary}
            wording="Voir le détail de l’offre"
            navigateTo={{ screen: 'Offer', params: { id: offer.id, from: 'bookingdetails' } }}
            onBeforeNavigate={onNavigateToOfferPress}
            fullWidth
          />
          <Spacer.Column numberOfSpaces={4} />
          <BookingDetailsCancelButton
            booking={booking}
            onCancel={cancelBooking}
            onTerminate={showArchiveModal}
            onViewTripDetails={viewTripDetails}
            fullWidth
          />
        </ViewWithPadding>
        <Spacer.Column numberOfSpaces={5} />
      </ScrollView>
      {/* BookingDetailsHeader is called after Body to implement the BlurView for iOS */}
      <BookingDetailsHeader headerTransition={headerTransition} title={offer.name} />

      <CancelBookingModal visible={cancelModalVisible} dismissModal={hideModal} booking={booking} />
      <ArchiveBookingModal
        visible={archiveModalVisible}
        bookingId={booking.id}
        bookingTitle={offer.name}
        onDismiss={hideArchiveModal}
      />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const OfferRules = styled(Typo.CaptionNeutralInfo)({
  textAlign: 'center',
})

const ViewWithPadding = styled.View({
  paddingHorizontal: getSpacing(5),
})
