import { useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'
import { Platform, ScrollView, useWindowDimensions } from 'react-native'
import { useQueryClient } from 'react-query'
import styled from 'styled-components/native'

import { useAppSettings } from 'features/auth/settings'
import { useBookings, useOngoingOrEndedBooking } from 'features/bookings/api'
import { ArchiveBookingModal } from 'features/bookings/components/ArchiveBookingModal'
import { BookingDetailsCancelButton } from 'features/bookings/components/BookingDetailsCancelButton'
import { BookingDetailsHeader } from 'features/bookings/components/BookingDetailsHeader'
import { BookingPropertiesSection } from 'features/bookings/components/BookingPropertiesSection'
import { CancelBookingModal } from 'features/bookings/components/CancelBookingModal'
import { TicketSwiper } from 'features/bookings/components/Ticket/TicketSwiper'
import { getBookingProperties, getOfferRules } from 'features/bookings/helpers'
import { BookingNotFound } from 'features/bookings/pages/BookingNotFound'
import { Booking } from 'features/bookings/types'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { mergeOfferData } from 'features/offer/atoms/OfferTile'
import { formatFullAddress } from 'libs/address/useFormatFullAddress'
import { analytics, isCloseToBottom } from 'libs/firebase/analytics'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { SeeItineraryButton } from 'libs/itinerary/components/SeeItineraryButton'
import { getGoogleMapsItineraryUrl } from 'libs/itinerary/openGoogleMapsItinerary'
import { eventMonitoring, ScreenError } from 'libs/monitoring'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { useHeaderTransition } from 'ui/components/headers/animationHelpers'
import { HeroHeader } from 'ui/components/hero/HeroHeader'
import { blurImageHeight, heroMarginTop } from 'ui/components/hero/useHeroDimensions'
import { LoadingPage } from 'ui/components/LoadingPage'
import { useModal } from 'ui/components/modals/useModal'
import { Separator } from 'ui/components/Separator'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'
import { Helmet } from 'ui/web/global/Helmet'

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

  const { data: appSettings } = useAppSettings()
  const mapping = useSubcategoriesMapping()

  const { venue, id: offerId } = booking?.stock.offer || {}
  const { address, postalCode, city } = venue || {}
  const venueFullAddress = address ? formatFullAddress(address, postalCode, city) : undefined

  const { data: bookings } = useBookings()
  const { ended_bookings: endedBookings = emptyBookings } = bookings || {}
  const { showInfoSnackBar, showErrorSnackBar } = useSnackBarContext()

  const { navigate } = useNavigation<UseNavigationType>()

  // Allows to display a message in case of refresh specifying the cancellation
  // of the reservation being consulted if it is made via Flask Admin
  const cancellationConsultedBooking = endedBookings.filter((item) => item.id === params.id)
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

  const { headerTransition, onScroll } = useHeaderTransition({
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
  const activationCodeFeatureEnabled = appSettings?.autoActivateDigitalBookings

  const offerRules = getOfferRules(properties, booking, activationCodeFeatureEnabled)

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

  const helmetTitle = `Ma réservation pour ${booking.stock.offer.name} | pass Culture`
  return (
    <Container>
      <Helmet title={helmetTitle} />
      <BookingDetailsHeader headerTransition={headerTransition} title={offer.name} />
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
        <TicketSwiper
          booking={booking}
          activationCodeFeatureEnabled={activationCodeFeatureEnabled}
        />
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
          <TouchableLink
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
            activationCodeFeatureEnabled={activationCodeFeatureEnabled}
            onCancel={cancelBooking}
            onTerminate={showArchiveModal}
            fullWidth
          />
        </ViewWithPadding>
        <Spacer.Column numberOfSpaces={5} />
      </ScrollView>

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
