import { t } from '@lingui/macro'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  LayoutRectangle,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import QRCode from 'react-native-qrcode-svg'
import styled from 'styled-components/native'

import { CategoryNameEnum } from 'api/gen'
import { useOngoingBooking } from 'features/bookings/api/queries'
import { BookingDetailsHeader } from 'features/bookings/components/BookingDetailsHeader'
import { BookingPropertiesSection } from 'features/bookings/components/BookingPropertiesSection'
import { CancelBookingModal } from 'features/bookings/components/CancelBookingModal'
import {
  ThreeShapesTicket,
  TICKET_MIN_HEIGHT,
} from 'features/bookings/components/ThreeShapesTicket'
import { getBookingProperties } from 'features/bookings/helpers'
import { openExternalUrl } from 'features/navigation/helpers'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator'
import { useFunctionOnce } from 'features/offer/services/useFunctionOnce'
import { analytics } from 'libs/analytics'
import { isCloseToBottom } from 'libs/analytics.utils'
import { SeeItineraryButton } from 'libs/itinerary/components/SeeItineraryButton'
import useOpenItinerary from 'libs/itinerary/useOpenItinerary'
import { formatToCompleteFrenchDate } from 'libs/parsers'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { interpolationConfig } from 'ui/components/headers/animationHelpers'
import { blurImageHeight, HeroHeader } from 'ui/components/headers/HeroHeader'
import { useModal } from 'ui/components/modals/useModal'
import { Separator } from 'ui/components/Separator'
import { ticketFooterRatio } from 'ui/svg/TicketFooter'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

const TICKET_MAX_WIDTH = 300
const TICKET_WIDTH = Dimensions.get('screen').width - getSpacing(15)
const QR_CODE_SIZE = 170
const MINIMAL_TICKET_CONTENT_SIZE = 100
const MINIMAL_BACKGROUND_SIZE = TICKET_MIN_HEIGHT + MINIMAL_TICKET_CONTENT_SIZE

const contentHeight = Dimensions.get('window').height - blurImageHeight

export function BookingDetails() {
  const { params } = useRoute<UseRouteType<'BookingDetails'>>()
  const { navigate } = useNavigation<UseNavigationType>()
  const booking = useOngoingBooking(params.id, params.shouldFetchAll)
  const headerScroll = useRef(new Animated.Value(0)).current
  const { visible: cancelModalVisible, showModal: showCancelModal, hideModal } = useModal(false)

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
  const shouldDisplayEAN = offer.extraData?.isbn && offer.category.name === CategoryNameEnum.LIVRE
  const shouldDisplayItineraryButton =
    canOpenItinerary && (properties.isEvent || (properties.isPhysical && !properties.isDigital))

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

  const renderCancellationCTA = () => {
    const renderButton = (
      <ButtonSecondary
        title={t`Annuler ma réservation`}
        onPress={cancelBooking}
        testIdSuffix={'cancel'}
      />
    )
    if (booking.confirmationDate) {
      const isStillCancellable = new Date(booking.confirmationDate) > new Date()
      const formattedConfirmationDate = formatToCompleteFrenchDate(
        new Date(booking.confirmationDate),
        false
      )
      if (isStillCancellable) {
        return (
          <React.Fragment>
            {renderButton}
            <Spacer.Column numberOfSpaces={4} />
            <CancellationCaption>
              {t`La réservation est annulable jusqu'au` + '\u00a0' + formattedConfirmationDate}
            </CancellationCaption>
          </React.Fragment>
        )
      } else {
        return (
          <CancellationCaption>
            {t`Tu ne peux plus annuler ta réservation : elle devait être annulée avant le` +
              '\u00a0' +
              formattedConfirmationDate}
          </CancellationCaption>
        )
      }
    }
    return renderButton
  }

  const navigateToOffer = () => {
    analytics.logConsultOffer({ offerId: offer.id, from: 'bookings' })
    navigate('Offer', {
      id: offer.id,
      shouldDisplayLoginModal: false,
      from: 'bookingdetails',
    })
  }

  const accessExternalOffer = () => {
    if (offer.url) {
      analytics.logAccessExternalOffer(offer.id)
      openExternalUrl(offer.url)
    }
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
            onLayout={(event) => {
              updateTicketBottomPosition(event.nativeEvent.layout)
            }}>
            <ThreeShapesTicket width={ticketFooterWidth} color={ColorsEnum.WHITE}>
              <TicketContent>
                <Title>{offer.name}</Title>
                <TicketInnerContent>
                  <Token>{booking.token}</Token>
                  {properties.isDigital ? (
                    <InnerButtonContainer>
                      <ButtonPrimary title={t`Accéder à l'offre`} onPress={accessExternalOffer} />
                    </InnerButtonContainer>
                  ) : booking.qrCodeData ? (
                    <View testID="qr-code">
                      <QRCode value={booking.qrCodeData} size={QR_CODE_SIZE} />
                    </View>
                  ) : null}
                  {shouldDisplayEAN && (
                    <EANContainer>
                      <Typo.Caption>{t`EAN` + '\u00a0'}</Typo.Caption>
                      <Typo.Body color={ColorsEnum.GREY_DARK}>{offer.extraData?.isbn}</Typo.Body>
                    </EANContainer>
                  )}
                </TicketInnerContent>
              </TicketContent>
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
          {renderCancellationCTA()}
        </ViewWithPadding>
        <Spacer.Column numberOfSpaces={5} />
      </ScrollView>

      <CancelBookingModal visible={cancelModalVisible} dismissModal={hideModal} booking={booking} />
      <BookingDetailsHeader headerTransition={headerTransition} title={offer.name} />
    </React.Fragment>
  )
}

const paddingHorizontal = getSpacing(5)

const TicketContainer = styled.View({
  flex: 1,
})

const TicketContent = styled.View({
  paddingHorizontal: getSpacing(7),
  paddingVertical: getSpacing(2),
  alignItems: 'center',
  minHeight: TICKET_MIN_HEIGHT,
})

const Title = styled(Typo.Title3)({
  paddingHorizontal: getSpacing(1),
  textAlign: 'center',
})

const Token = styled(Typo.Title4)({
  color: ColorsEnum.PRIMARY,
  textAlign: 'center',
  padding: getSpacing(2.5),
})

const TicketInnerContent = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
})

const InnerButtonContainer = styled.View({
  flexDirection: 'row',
})

const EANContainer = styled.View({
  paddingTop: getSpacing(2.5),
  flexDirection: 'row',
  alignItems: 'center',
})

const OfferRules = styled(Typo.Caption)({
  color: ColorsEnum.GREY_DARK,
  textAlign: 'center',
})

const ViewWithPadding = styled.View({
  paddingHorizontal,
})

const CancellationCaption = styled(Typo.Caption)({
  textAlign: 'center',
  color: ColorsEnum.GREY_DARK,
})
