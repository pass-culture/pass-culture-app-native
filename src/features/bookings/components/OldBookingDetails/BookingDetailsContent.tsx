import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { BookingReponse } from 'api/gen'
import { ArchiveBookingModal } from 'features/bookings/components/ArchiveBookingModal'
import { BookingDetailsHeader } from 'features/bookings/components/BookingDetailsHeader'
import { BookingPropertiesSection } from 'features/bookings/components/BookingPropertiesSection'
import { CancelBookingModal } from 'features/bookings/components/CancelBookingModal'
import { BookingDetailsCancelButton } from 'features/bookings/components/OldBookingDetails/BookingDetailsCancelButton'
import { TicketSwiper } from 'features/bookings/components/OldBookingDetails/Ticket/TicketSwiper'
import { getOfferRules } from 'features/bookings/helpers'
import { isEligibleBookingsForArchive } from 'features/bookings/helpers/expirationDateUtils'
import { Booking, BookingProperties } from 'features/bookings/types'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { blurImageHeight } from 'features/offer/helpers/useOfferImageContainerDimensions'
import { isCloseToBottom } from 'libs/analytics'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { analytics } from 'libs/analytics/provider'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { SeeItineraryButton } from 'libs/itinerary/components/SeeItineraryButton'
import { getGoogleMapsItineraryUrl } from 'libs/itinerary/openGoogleMapsItinerary'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { SubcategoriesMapping } from 'libs/subcategories/types'
import { useBookingsQuery } from 'queries/bookings'
import { formatFullAddress } from 'shared/address/addressFormatter'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { HeaderWithImage } from 'ui/components/headers/HeaderWithImage'
import { useModal } from 'ui/components/modals/useModal'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { Separator } from 'ui/components/Separator'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { showErrorSnackBar, showSuccessSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'
import { Page } from 'ui/pages/Page'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { getSpacing, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'
import { Helmet } from 'ui/web/global/Helmet'

const scrollIndicatorInsets = { right: 1 }
const emptyBookings: Booking[] = []

export const BookingDetailsContent = ({
  paramsId,
  booking,
  properties,
  mapping,
}: {
  paramsId: number
  booking: BookingReponse
  properties: BookingProperties
  mapping: SubcategoriesMapping
}) => {
  const windowHeight = useWindowDimensions().height - blurImageHeight
  const netInfo = useNetInfoContext()

  const prePopulateOffer = usePrePopulateOffer()
  const { visible: cancelModalVisible, showModal: showCancelModal, hideModal } = useModal(false)
  const {
    visible: archiveModalVisible,
    showModal: showArchiveModal,
    hideModal: hideArchiveModal,
  } = useModal(false)

  const { id: offerId, address } = booking?.stock.offer ?? {}
  const offerFullAddress = address
    ? formatFullAddress(address.street, address.postalCode, address.city)
    : undefined

  const { data: bookings } = useBookingsQuery()
  const { ended_bookings: endedBookings = emptyBookings } = bookings ?? {}

  const { navigate } = useNavigation<UseNavigationType>()

  // Allows to display a message in case of refresh specifying the cancellation
  // of the reservation being consulted if it is made via Flask Admin
  // and booking is not archived
  const cancellationConsultedBooking = endedBookings.find(
    (item: BookingReponse) => item.id === paramsId && !isEligibleBookingsForArchive(item)
  )
  const nameCanceledBooking = cancellationConsultedBooking?.stock.offer.name

  useEffect(() => {
    if (!nameCanceledBooking) return

    showSuccessSnackBar(`Ta réservation "${nameCanceledBooking}" a été annulée`)

    navigate('Bookings')
  }, [nameCanceledBooking, navigate])

  const logConsultWholeBooking = useFunctionOnce(
    () => offerId && analytics.logBookingDetailsScrolledToBottom(offerId)
  )

  const { headerTransition, onScroll } = useOpacityTransition({
    listener: ({ nativeEvent }) => {
      if (isCloseToBottom(nativeEvent)) logConsultWholeBooking()
    },
  })

  const { offer } = booking.stock
  const shouldDisplayItineraryButton =
    !!offerFullAddress && (properties.isEvent || (properties.isPhysical && !properties.isDigital))

  const offerRules = getOfferRules(properties, booking)

  const cancelBooking = () => {
    showCancelModal()
    void analytics.logCancelBooking(offer.id)
  }
  const onEmailPress = () => {
    void analytics.logClickEmailOrganizer()
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

      triggerConsultOfferLog({ offerId: offer.id, from: 'bookings' })
    } else {
      showErrorSnackBar(
        'Impossible d’afficher le détail de l’offre. Connecte-toi à internet avant de réessayer.'
      )
    }
  }

  const helmetTitle = `Ma réservation pour ${booking.stock.offer.name} | pass Culture`

  const bookingContactEmail = booking.stock.offer.bookingContact

  return (
    <Page>
      <Helmet title={helmetTitle} />
      <StyledScrollView
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
        <StyledHeaderWithImage imageHeight={blurImageHeight} imageUrl={offer.image?.url} />
        <TicketSwiper booking={booking} />
        <ViewGap gap={6}>
          <InfoContainer gap={6}>
            {offerRules === '' ? null : <OfferRules>{offerRules}</OfferRules>}

            {bookingContactEmail ? (
              <React.Fragment>
                <ViewGap gap={2.5}>
                  <Typo.Title4 {...getHeadingAttrs(2)}>Contact de l’organisateur</Typo.Title4>

                  <StyledBodyAccentXs>
                    Si tu n’as pas reçu tes billets, contacte l’organisateur
                  </StyledBodyAccentXs>

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
                </ViewGap>

                <Separator.Horizontal />
              </React.Fragment>
            ) : null}
            <BookingPropertiesSection booking={booking} />
            {shouldDisplayItineraryButton ? (
              <React.Fragment>
                <Separator.Horizontal />
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
            <SectionWithDivider visible={!!offer.withdrawalDetails} gap={8}>
              <InfoContainer gap={4}>
                <Typo.Title4 {...getHeadingAttrs(2)}>Modalités de retrait</Typo.Title4>
                <Typo.Body testID="withdrawalDetails">{offer.withdrawalDetails}</Typo.Body>
              </InfoContainer>
            </SectionWithDivider>
          ) : null}

          <InfoButtonsContainer gap={4}>
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
          </InfoButtonsContainer>
        </ViewGap>
      </StyledScrollView>
      {/* BookingDetailsHeader is called after Body to implement the BlurView for iOS */}
      <BookingDetailsHeader headerTransition={headerTransition} title={offer.name} />

      <CancelBookingModal visible={cancelModalVisible} dismissModal={hideModal} booking={booking} />
      <ArchiveBookingModal
        visible={archiveModalVisible}
        bookingId={booking.id}
        bookingTitle={offer.name}
        onDismiss={hideArchiveModal}
      />
    </Page>
  )
}

const StyledScrollView = styled.ScrollView.attrs({
  contentContainerStyle: {
    paddingBottom: getSpacing(5),
  },
})``

const OfferRules = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
  textAlign: 'center',
}))

const InfoContainer = styled(ViewGap)(({ theme }) => ({
  paddingHorizontal: theme.designSystem.size.spacing.xl,
}))

const InfoButtonsContainer = styled(ViewGap)(({ theme }) => ({
  paddingHorizontal: theme.designSystem.size.spacing.xl,
  marginTop: theme.designSystem.size.spacing.s,
}))

const SendEmailContainer = styled.View({
  alignItems: 'flex-start',
})

const StyledHeaderWithImage = styled(HeaderWithImage)({
  marginBottom: getSpacing(32),
})

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
