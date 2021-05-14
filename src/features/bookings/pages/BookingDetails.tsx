import { t } from '@lingui/macro'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  LayoutRectangle,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import styled from 'styled-components/native'

import { useAppSettings } from 'features/auth/settings'
import { useOngoingBooking } from 'features/bookings/api/queries'
import { ArchiveBookingModal } from 'features/bookings/components/ArchiveBookingModal'
import { BookingDetailsCancelButton } from 'features/bookings/components/BookingDetailsCancelButton'
import { BookingDetailsHeader } from 'features/bookings/components/BookingDetailsHeader'
import { BookingDetailsTicketContent } from 'features/bookings/components/BookingDetailsTicketContent'
import { BookingPropertiesSection } from 'features/bookings/components/BookingPropertiesSection'
import { CancelBookingModal } from 'features/bookings/components/CancelBookingModal'
import {
  ThreeShapesTicket,
  TICKET_MIN_HEIGHT,
} from 'features/bookings/components/ThreeShapesTicket'
import { getBookingProperties } from 'features/bookings/helpers'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { useFunctionOnce } from 'features/offer/services/useFunctionOnce'
import { analytics } from 'libs/analytics'
import { isCloseToBottom } from 'libs/analytics.utils'
import { SeeItineraryButton } from 'libs/itinerary/components/SeeItineraryButton'
import useOpenItinerary from 'libs/itinerary/useOpenItinerary'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { interpolationConfig } from 'ui/components/headers/animationHelpers'
import { blurImageHeight, HeroHeader } from 'ui/components/headers/HeroHeader'
import { useModal } from 'ui/components/modals/useModal'
import { Separator } from 'ui/components/Separator'
import { ticketFooterRatio } from 'ui/svg/TicketFooter'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

const TICKET_MAX_WIDTH = 300
const TICKET_WIDTH = Dimensions.get('screen').width - getSpacing(15)
const MINIMAL_TICKET_CONTENT_SIZE = 100
const MINIMAL_BACKGROUND_SIZE = TICKET_MIN_HEIGHT + MINIMAL_TICKET_CONTENT_SIZE

const contentHeight = Dimensions.get('window').height - blurImageHeight

export function BookingDetails() {
  const { params } = useRoute<UseRouteType<'BookingDetails'>>()
  const { navigate } = useNavigation<UseNavigationType>()
  const booking = useOngoingBooking(params.id, params.shouldFetchAll)
  const headerScroll = useRef(new Animated.Value(0)).current
  const { visible: cancelModalVisible, showModal: showCancelModal, hideModal } = useModal(false)
  const {
    visible: archiveModalVisible,
    showModal: showArchiveModal,
    hideModal: hideArchiveModal,
  } = useModal(false)

  const { data: appSettings } = useAppSettings()

  const { venue, id: offerId } = booking?.stock.offer || {}
  const { latitude, longitude } = venue?.coordinates || {}
  const { canOpenItinerary, openItinerary } = useOpenItinerary(
    latitude,
    longitude,
    async () => void (offerId && analytics.logConsultItinerary(offerId, 'bookingdetails'))
  )

  const logConsultWholeBooking = useFunctionOnce(
    () => offerId && analytics.logBookingDetailsScrolledToBottom(offerId)
  )
  const [ticketBottomPosition, setTicketBottomPosition] = useState(MINIMAL_BACKGROUND_SIZE)

  if (!booking) return <React.Fragment></React.Fragment>

  const headerTransition = headerScroll.interpolate(interpolationConfig)

  const checkIfAllPageHaveBeenSeen = ({ nativeEvent }: { nativeEvent: NativeScrollEvent }) => {
    if (isCloseToBottom(nativeEvent)) {
      logConsultWholeBooking()
    }
  }

  const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: headerScroll } } }], {
    useNativeDriver: false,
    listener: ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      checkIfAllPageHaveBeenSeen({ nativeEvent })
    },
  })

  const properties = getBookingProperties(booking)
  const { offer } = booking.stock
  const shouldDisplayItineraryButton =
    canOpenItinerary && (properties.isEvent || (properties.isPhysical && !properties.isDigital))
  const activationCodeFeatureEnabled = appSettings && appSettings.autoActivateDigitalBookings

  const renderOfferRules = properties.isDigital ? (
    <OfferRules>
      {t`Ce code à 6 caractères est ta preuve d’achat ! N’oublie pas que tu n’as pas le droit de le revendre ou le céder.`}
    </OfferRules>
  ) : properties.isPhysical || properties.isEvent ? (
    <OfferRules>
      {t`Tu dois présenter ta carte d’identité et ce code de 6 caractères pour profiter de ta réservation ! N’oublie pas que tu n’as pas le droit de le revendre ou le céder.`}
    </OfferRules>
  ) : (
    ''
  )

  const cancelBooking = () => {
    showCancelModal()
    analytics.logCancelBooking(offer.id)
  }

  const navigateToOffer = () => {
    analytics.logConsultOffer({ offerId: offer.id, from: 'bookings' })
    navigate('Offer', {
      id: offer.id,
      from: 'bookingdetails',
    })
  }

  const ticketFooterWidth = Math.min(TICKET_WIDTH, TICKET_MAX_WIDTH)
  const ticketFooterHeigth = ticketFooterWidth / ticketFooterRatio

  const updateTicketBottomPosition = (layout: LayoutRectangle) => {
    const { y, height } = layout
    const newBackgroudSize = y + height - ticketFooterHeigth
    if (MINIMAL_BACKGROUND_SIZE < newBackgroudSize) {
      setTicketBottomPosition(newBackgroudSize)
    }
  }

  return (
    <React.Fragment>
      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={10}
        scrollIndicatorInsets={{ right: 1 }}
        onContentSizeChange={(_w: number, h: number) => {
          if (h <= contentHeight) {
            logConsultWholeBooking()
          }
        }}
        testID="BookingDetailsScrollView"
        bounces={false}>
        <HeroHeader
          minHeight={ticketBottomPosition + ticketFooterHeigth - 1}
          imageHeight={ticketBottomPosition}
          categoryName={offer.category.name}
          imageUrl={offer.image?.url || ''}>
          <Spacer.Column numberOfSpaces={18} />
          <TicketContainer
            // TODO remove this by adaping component to design
            // https://passculture.atlassian.net/browse/PC-8272
            onLayout={(event) => {
              updateTicketBottomPosition(event.nativeEvent.layout)
            }}>
            <ThreeShapesTicket width={ticketFooterWidth} color={ColorsEnum.WHITE}>
              <BookingDetailsTicketContent
                booking={booking}
                activationCodeFeatureEnabled={activationCodeFeatureEnabled}
              />
            </ThreeShapesTicket>
          </TicketContainer>
        </HeroHeader>

        <ViewWithPadding>
          <Spacer.Column numberOfSpaces={4} />
          {renderOfferRules}
          <Spacer.Column numberOfSpaces={8} />
          <BookingPropertiesSection booking={booking} />
          {shouldDisplayItineraryButton && (
            <React.Fragment>
              <Spacer.Column numberOfSpaces={4} />
              <Separator />
              <Spacer.Column numberOfSpaces={4} />
              <SeeItineraryButton openItinerary={openItinerary} />
            </React.Fragment>
          )}
          {offer.withdrawalDetails && (
            <React.Fragment>
              <Spacer.Column numberOfSpaces={8} />
              <Typo.Title4>{t`Modalités de retrait`}</Typo.Title4>
              <Spacer.Column numberOfSpaces={4} />
              <Typo.Body testID="withdrawalDetails">{offer.withdrawalDetails}</Typo.Body>
            </React.Fragment>
          )}
          <Spacer.Column numberOfSpaces={8} />
          <ButtonPrimary
            testIdSuffix="see-offer-details"
            title={t`Voir le détail de l’offre`}
            onPress={navigateToOffer}
          />
          <Spacer.Column numberOfSpaces={4} />
          <BookingDetailsCancelButton
            booking={booking}
            activationCodeFeatureEnabled={activationCodeFeatureEnabled}
            onCancel={cancelBooking}
            onTerminate={showArchiveModal}
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
    </React.Fragment>
  )
}

const paddingHorizontal = getSpacing(5)

const TicketContainer = styled.View({
  flex: 1,
})

const OfferRules = styled(Typo.Caption)({
  color: ColorsEnum.GREY_DARK,
  textAlign: 'center',
})

const ViewWithPadding = styled.View({
  paddingHorizontal,
})
