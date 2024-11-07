import { useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'
import { Platform, ScrollView, useWindowDimensions, View } from 'react-native'
import styled from 'styled-components/native'

import { BookingReponse } from 'api/gen'
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
import {
  blurImageHeight,
  offerImageContainerMarginTop,
} from 'features/offer/helpers/useOfferImageContainerDimensions'
import { formatFullAddress } from 'libs/address/useFormatFullAddress'
import { analytics, isCloseToBottom } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { SeeItineraryButton } from 'libs/itinerary/components/SeeItineraryButton'
import { getGoogleMapsItineraryUrl } from 'libs/itinerary/openGoogleMapsItinerary'
import { eventMonitoring, ScreenError } from 'libs/monitoring'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { HeaderWithImage } from 'ui/components/headers/HeaderWithImage'
import { LoadingPage } from 'ui/components/LoadingPage'
import { useModal } from 'ui/components/modals/useModal'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { Separator } from 'ui/components/Separator'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'
import { Helmet } from 'ui/web/global/Helmet'

const scrollIndicatorInsets = { right: 1 }
const emptyBookings: Booking[] = []

export function BookingDetails() {
  const enableBookingImprove = useFeatureFlag(RemoteStoreFeatureFlags.WIP_BOOKING_IMPROVE)
  const windowHeight = useWindowDimensions().height - blurImageHeight
  const netInfo = useNetInfoContext()
  const { logType } = useLogTypeFromRemoteConfig()
  const { params } = useRoute<UseRouteType<'BookingDetails'>>()
  const {
    status,
    data: booking,
    isLoading,
    isError,
    error,
    dataUpdatedAt,
  } = useOngoingOrEndedBooking(params.id)

  const prePopulateOffer = usePrePopulateOffer()
  const { visible: cancelModalVisible, showModal: showCancelModal, hideModal } = useModal(false)
  const {
    visible: archiveModalVisible,
    showModal: showArchiveModal,
    hideModal: hideArchiveModal,
  } = useModal(false)

  const mapping = useSubcategoriesMapping()

  const { id: offerId, address } = booking?.stock.offer ?? {}
  const offerFullAddress = address
    ? formatFullAddress(address.street, address.postalCode, address.city)
    : undefined

  const { data: bookings } = useBookings()
  const { ended_bookings: endedBookings = emptyBookings } = bookings ?? {}

  const { showInfoSnackBar, showErrorSnackBar } = useSnackBarContext()

  const { navigate } = useNavigation<UseNavigationType>()

  // Allows to display a message in case of refresh specifying the cancellation
  // of the reservation being consulted if it is made via Flask Admin
  // and booking is not archived
  const cancellationConsultedBooking: BookingReponse[] = endedBookings.filter(
    (item) => item.id === params.id && !isEligibleBookingsForArchive(item)
  )
  const nameCanceledBooking = cancellationConsultedBooking[0]?.stock.offer.name

  if (nameCanceledBooking) {
    showInfoSnackBar({
      message: `Ta réservation "${nameCanceledBooking}" a été annulée`,
      timeout: SNACK_BAR_TIME_OUT,
    })
    if (enableBookingImprove) {
      navigate('Bookings')
    } else {
      navigate('EndedBookings')
    }
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
    throw new ScreenError(`Booking #${params.id} not found`, {
      Screen: BookingNotFound,
      logType,
    })
  } else if (isError) {
    throw error
  } else if (!booking) {
    // dead code to satisfy typescript Web compilation
    return null
  }

  const { offer } = booking.stock
  const properties = getBookingProperties(booking, mapping[offer.subcategoryId].isEvent)
  const shouldDisplayItineraryButton =
    !!offerFullAddress && (properties.isEvent || (properties.isPhysical && !properties.isDigital))

  const offerRules = getOfferRules(properties, booking)

  const cancelBooking = () => {
    showCancelModal()
    analytics.logCancelBooking(offer.id)
  }
  const onEmailPress = () => {
    analytics.logClickEmailOrganizer()
  }
  const onNavigateToOfferPress = () => {
    if (netInfo.isConnected) {
      prePopulateOffer({
        ...offer,
        categoryId: mapping[offer.subcategoryId].categoryId,
        thumbUrl: offer.image?.url,
        name: offer.name,
        offerId: offer.id,
      })

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

  const bookingContactEmail = booking.stock.offer.bookingContact

  return (
    <Container>
      <Helmet title={helmetTitle} />
      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        scrollIndicatorInsets={scrollIndicatorInsets}
        onContentSizeChange={(_w: number, h: number) => {
          if (h <= windowHeight) {
            logConsultWholeBooking()
          }
        }}
        testID="BookingDetailsScrollView"
        bounces={false}>
        <HeaderWithImage imageHeight={blurImageHeight} imageUrl={offer.image?.url} />
        <Spacer.Column numberOfSpaces={offerImageContainerMarginTop} />
        <TicketSwiper booking={booking} />
        <View>
          <InfoContainer>
            <Spacer.Column numberOfSpaces={6} />
            <OfferRules>{offerRules}</OfferRules>
            <Spacer.Column numberOfSpaces={offerRules === '' ? 2 : 6} />

            {bookingContactEmail ? (
              <React.Fragment>
                <Typo.Title4 {...getHeadingAttrs(2)}>Contact de l’organisateur</Typo.Title4>
                <Spacer.Column numberOfSpaces={2.5} />
                <Typo.CaptionNeutralInfo>
                  Si tu n’as pas reçu tes billets, contacte l’organisateur
                </Typo.CaptionNeutralInfo>
                <Spacer.Column numberOfSpaces={2.5} />
                <SendEmailContainer>
                  <ExternalTouchableLink
                    as={ButtonTertiaryBlack}
                    inline
                    wording={bookingContactEmail}
                    accessibilityLabel="Ouvrir le gestionnaire mail pour contacter l’organisateur"
                    externalNav={{ url: `mailto:${bookingContactEmail}` }}
                    icon={EmailFilled}
                    onBeforeNavigate={onEmailPress}
                  />
                </SendEmailContainer>

                <Spacer.Column numberOfSpaces={6} />
                <Separator.Horizontal />
                <Spacer.Column numberOfSpaces={6} />
              </React.Fragment>
            ) : null}
            <BookingPropertiesSection booking={booking} />
            {shouldDisplayItineraryButton ? (
              <React.Fragment>
                <Spacer.Column numberOfSpaces={4} />
                <Separator.Horizontal />
                <Spacer.Column numberOfSpaces={4} />
                <SeeItineraryButton
                  externalNav={{
                    url: getGoogleMapsItineraryUrl(offerFullAddress),
                    address: offerFullAddress,
                  }}
                  onPress={() =>
                    offerId && analytics.logConsultItinerary({ offerId, from: 'bookingdetails' })
                  }
                />
              </React.Fragment>
            ) : null}
          </InfoContainer>

          {offer.withdrawalDetails ? (
            <React.Fragment>
              <Spacer.Column numberOfSpaces={6} />
              <SectionWithDivider visible={!!offer.withdrawalDetails} gap={8}>
                <InfoContainer>
                  <Typo.Title4 {...getHeadingAttrs(2)}>Modalités de retrait</Typo.Title4>
                  <Spacer.Column numberOfSpaces={4} />
                  <Typo.Body testID="withdrawalDetails">{offer.withdrawalDetails}</Typo.Body>
                </InfoContainer>
              </SectionWithDivider>
            </React.Fragment>
          ) : null}

          <Spacer.Column numberOfSpaces={14} />

          <InfoBottomContainer gap={4}>
            <InternalTouchableLink
              enableNavigate={!!netInfo.isConnected}
              as={ButtonPrimary}
              wording="Voir le détail de l’offre"
              navigateTo={{ screen: 'Offer', params: { id: offer.id, from: 'bookingdetails' } }}
              onBeforeNavigate={onNavigateToOfferPress}
              fullWidth
            />
            <BookingDetailsCancelButton
              booking={booking}
              onCancel={cancelBooking}
              onTerminate={showArchiveModal}
              fullWidth
            />
          </InfoBottomContainer>
        </View>
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

const InfoContainer = styled.View({
  paddingHorizontal: getSpacing(6),
})

const InfoBottomContainer = styled(ViewGap)({
  paddingHorizontal: getSpacing(6),
})

const SendEmailContainer = styled.View({
  alignItems: 'flex-start',
})
