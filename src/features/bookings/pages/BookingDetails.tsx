import { t } from '@lingui/macro'
import { useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'
import { useWindowDimensions } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useQueryClient } from 'react-query'
import styled from 'styled-components/native'

import { useAppSettings } from 'features/auth/settings'
import { useOngoingOrEndedBooking } from 'features/bookings/api/queries'
import { ArchiveBookingModal } from 'features/bookings/components/ArchiveBookingModal'
import { BookingDetailsCancelButton } from 'features/bookings/components/BookingDetailsCancelButton'
import { BookingDetailsHeader } from 'features/bookings/components/BookingDetailsHeader'
import { BookingDetailsTicketContent } from 'features/bookings/components/BookingDetailsTicketContent'
import { BookingPropertiesSection } from 'features/bookings/components/BookingPropertiesSection'
import { CancelBookingModal } from 'features/bookings/components/CancelBookingModal'
import { ThreeShapesTicket } from 'features/bookings/components/ThreeShapesTicket'
import { BookingProperties, getBookingProperties } from 'features/bookings/helpers'
import { BookingNotFound } from 'features/bookings/pages/BookingNotFound'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { mergeOfferData } from 'features/offer/atoms/OfferTile'
import { useFunctionOnce } from 'features/offer/services/useFunctionOnce'
import { analytics, isCloseToBottom } from 'libs/analytics'
import { SeeItineraryButton } from 'libs/itinerary/components/SeeItineraryButton'
import useOpenItinerary from 'libs/itinerary/useOpenItinerary'
import { ScreenError } from 'libs/monitoring'
import { QueryKeys } from 'libs/queryKeys'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { useHeaderTransition } from 'ui/components/headers/animationHelpers'
import { HeroHeader } from 'ui/components/hero/HeroHeader'
import { blurImageHeight, heroMarginTop } from 'ui/components/hero/useHeroDimensions'
import { LoadingPage } from 'ui/components/LoadingPage'
import { useModal } from 'ui/components/modals/useModal'
import { Separator } from 'ui/components/Separator'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

const getOfferRules = (
  properties: BookingProperties,
  activationCodeFeatureEnabled?: boolean
): string => {
  const { hasActivationCode, isDigital, isPhysical, isEvent } = properties
  if (hasActivationCode && activationCodeFeatureEnabled)
    return t`Ce code est ta preuve d’achat, il te permet d’accéder à ton offre ! N’oublie pas que tu n’as pas le droit de le revendre ou le céder.`
  if (isDigital)
    return t`Ce code à 6 caractères est ta preuve d’achat ! N’oublie pas que tu n’as pas le droit de le revendre ou le céder.`
  if (isPhysical || isEvent)
    return t`Tu dois présenter ta carte d’identité et ce code de 6 caractères pour profiter de ta réservation ! N’oublie pas que tu n’as pas le droit de le revendre ou le céder.`
  return ''
}

const scrollIndicatorInsets = { right: 1 }

export function BookingDetails() {
  const windowHeight = useWindowDimensions().height - blurImageHeight
  const { params } = useRoute<UseRouteType<'BookingDetails'>>()
  const { navigate } = useNavigation<UseNavigationType>()
  const { data: booking, isLoading, isError, error } = useOngoingOrEndedBooking(params.id)
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
  const { latitude, longitude } = venue?.coordinates || {}
  const { canOpenItinerary, openItinerary } = useOpenItinerary(
    `${latitude},${longitude}`,
    async () => void (offerId && analytics.logConsultItinerary({ offerId, from: 'bookingdetails' }))
  )

  const logConsultWholeBooking = useFunctionOnce(
    () => offerId && analytics.logBookingDetailsScrolledToBottom(offerId)
  )

  const { headerTransition, onScroll } = useHeaderTransition({
    listener: ({ nativeEvent }) => {
      if (isCloseToBottom(nativeEvent)) logConsultWholeBooking()
    },
  })

  if (isLoading && !booking) {
    return <LoadingPage />
  } else if (!isLoading && !booking) {
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
    canOpenItinerary && (properties.isEvent || (properties.isPhysical && !properties.isDigital))
  const activationCodeFeatureEnabled = appSettings && appSettings.autoActivateDigitalBookings

  const offerRules = getOfferRules(properties, activationCodeFeatureEnabled)

  const cancelBooking = () => {
    showCancelModal()
    analytics.logCancelBooking(offer.id)
  }

  const navigateToOffer = () => {
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
    navigate('Offer', { id: offer.id, from: 'bookingdetails' })
  }

  return (
    <Container>
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
        <HeroHeader type="offer" imageHeight={blurImageHeight} imageUrl={offer.image?.url}>
          <Spacer.Column numberOfSpaces={heroMarginTop} />
          <ThreeShapesTicket>
            <BookingDetailsTicketContent
              booking={booking}
              activationCodeFeatureEnabled={activationCodeFeatureEnabled}
            />
          </ThreeShapesTicket>
        </HeroHeader>

        <ViewWithPadding>
          <Spacer.Column numberOfSpaces={4} />
          <OfferRules>{offerRules}</OfferRules>
          <Spacer.Column numberOfSpaces={8} />
          <BookingPropertiesSection booking={booking} />
          {!!shouldDisplayItineraryButton && (
            <React.Fragment>
              <Spacer.Column numberOfSpaces={4} />
              <Separator />
              <Spacer.Column numberOfSpaces={4} />
              <SeeItineraryButton openItinerary={openItinerary} />
            </React.Fragment>
          )}
          {!!offer.withdrawalDetails && (
            <React.Fragment>
              <Spacer.Column numberOfSpaces={8} />
              <Typo.Title4>{t`Modalités de retrait`}</Typo.Title4>
              <Spacer.Column numberOfSpaces={4} />
              <Typo.Body testID="withdrawalDetails">{offer.withdrawalDetails}</Typo.Body>
            </React.Fragment>
          )}
          <Spacer.Column numberOfSpaces={8} />
          <ButtonPrimary
            testId="Voir le détail de l’offre"
            title={t`Voir le détail de l’offre`}
            onPress={navigateToOffer}
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
      <BookingDetailsHeader headerTransition={headerTransition} title={offer.name} />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const OfferRules = styled(Typo.Caption)({
  color: ColorsEnum.GREY_DARK,
  textAlign: 'center',
})

const ViewWithPadding = styled.View({
  paddingHorizontal: getSpacing(5),
})
