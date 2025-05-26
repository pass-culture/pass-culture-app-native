import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { ScrollView, useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import {
  BookingOfferResponseAddress,
  BookingReponse,
  BookingVenueResponse,
  UserProfileResponse,
} from 'api/gen'
import { ArchiveBookingModal } from 'features/bookings/components/ArchiveBookingModal'
import { BookingDetailsCancelButton } from 'features/bookings/components/BookingDetailsCancelButton'
import { BookingDetailsHeader } from 'features/bookings/components/BookingDetailsHeader'
import { BookingPrecisions } from 'features/bookings/components/BookingPrecision'
import { CancelBookingModal } from 'features/bookings/components/CancelBookingModal'
import { TicketCutout } from 'features/bookings/components/TicketCutout/TicketCutout'
import { TicketCutoutBottom } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/TicketCutoutBottom'
import { getBookingLabels } from 'features/bookings/helpers'
import { computeHeaderImageHeight } from 'features/bookings/helpers/computeHeaderImageHeight'
import { BookingProperties } from 'features/bookings/types'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { VenueBlockAddress, VenueBlockVenue } from 'features/offer/components/OfferVenueBlock/type'
import { VenueBlockWithItinerary } from 'features/offer/components/OfferVenueBlock/VenueBlockWithItinerary'
import { getAddress } from 'features/offer/helpers/getVenueBlockProps'
import { offerImageContainerMarginTop } from 'features/offer/helpers/useOfferImageContainerDimensions'
import { isCloseToBottom } from 'libs/analytics'
import { analytics } from 'libs/analytics/provider'
import { useFunctionOnce } from 'libs/hooks'
import { SubcategoriesMapping } from 'libs/subcategories/types'
import { formatFullAddress } from 'shared/address/addressFormatter'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { ErrorBanner } from 'ui/components/banners/ErrorBanner'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { HeaderWithImage } from 'ui/components/headers/HeaderWithImage'
import { useModal } from 'ui/components/modals/useModal'
import { Separator } from 'ui/components/Separator'
import { IdCard } from 'ui/svg/icons/IdCard'
import { getSpacing } from 'ui/theme'

const VENUE_THUMBNAIL_SIZE = getSpacing(15)
const scrollIndicatorInsets = { right: 1 }

export const BookingDetailsContent = ({
  properties,
  booking,
  mapping,
  user,
}: {
  properties: BookingProperties
  booking: BookingReponse
  mapping: SubcategoriesMapping
  user: UserProfileResponse
}) => {
  const { height: windowHeight } = useWindowDimensions()
  const [topBlockHeight, setTopBlockHeight] = React.useState<number>(0)

  const { headerImageHeight, scrollContentHeight } = computeHeaderImageHeight({
    topBlockHeight,
    windowHeight,
  })
  const { navigate } = useNavigation<UseNavigationType>()
  const { address } = booking?.stock.offer ?? {}
  const { visible: cancelModalVisible, showModal: showCancelModal, hideModal } = useModal(false)
  const {
    visible: archiveModalVisible,
    showModal: showArchiveModal,
    hideModal: hideArchiveModal,
  } = useModal(false)
  const offerFullAddress = address
    ? formatFullAddress(address.street, address.postalCode, address.city)
    : undefined

  const { offer } = booking.stock

  const { hourLabel, dayLabel } = getBookingLabels(booking, properties)

  const onEmailPress = () => {
    analytics.logClickEmailOrganizer()
  }
  const cancelBooking = () => {
    showCancelModal()
    analytics.logCancelBooking(offer.id)
  }

  const logConsultWholeBooking = useFunctionOnce(
    () => offer.id && analytics.logBookingDetailsScrolledToBottom(offer.id)
  )

  const { headerTransition, onScroll } = useOpacityTransition({
    listener: ({ nativeEvent }) => {
      if (isCloseToBottom(nativeEvent)) logConsultWholeBooking()
    },
  })

  const venueBlockAddress = getAddress(offer.address)

  const handleOnSeeVenuePress = () => {
    analytics.logConsultVenue({ venueId: offer.venue.id, from: 'bookings' })
    navigate('Venue', { id: offer.venue.id })
  }

  const errorBannerMessage = `Tu n’as pas le droit de céder ou de revendre ${properties.isDuo ? 'tes billets' : 'ton billet'}.`

  return user ? (
    <Container>
      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        scrollIndicatorInsets={scrollIndicatorInsets}
        onContentSizeChange={(_w: number, h: number) => {
          if (h <= scrollContentHeight) {
            logConsultWholeBooking()
          }
        }}
        testID="BookingDetailsScrollView"
        bounces={false}>
        <StyledHeaderWithImage imageHeight={headerImageHeight} imageUrl={offer.image?.url} />
        <TicketCutout
          hour={hourLabel == '' ? undefined : hourLabel}
          day={dayLabel == '' ? undefined : dayLabel}
          isDuo={properties.isDuo}
          offer={offer}
          mapping={mapping}
          venueInfo={
            <VenueBlockWithItinerary
              properties={properties}
              offerFullAddress={offerFullAddress}
              venue={getVenueBlockVenue(booking.stock.offer.venue)}
              address={getVenueBlockAddress(booking.stock.offer.address)}
              offerId={offer.id}
              thumbnailSize={VENUE_THUMBNAIL_SIZE}
              addressLabel={venueBlockAddress?.label ?? undefined}
              onSeeVenuePress={offer.venue.isOpenToPublic ? handleOnSeeVenuePress : undefined}
            />
          }
          title={offer.name}
          infoBanner={
            <InfoBanner
              message="Tu auras besoin de ta carte d’identité pour accéder à l’évènement."
              icon={IdCard}
            />
          }
          onTopBlockLayout={setTopBlockHeight}>
          <TicketCutoutBottom offer={offer} booking={booking} userEmail={user?.email} />
        </TicketCutout>
        <ErrorBannerContainer>
          <ErrorBanner message={errorBannerMessage} />
        </ErrorBannerContainer>
        {booking.stock.offer.bookingContact || offer.withdrawalDetails ? (
          <React.Fragment>
            <StyledSeparator height={getSpacing(8)} />
            <BookingPrecisions
              bookingContactEmail={booking.stock.offer.bookingContact}
              withdrawalDetails={offer.withdrawalDetails}
              onEmailPress={onEmailPress}
            />
          </React.Fragment>
        ) : null}
        <StyledSeparator height={getSpacing(8)} />
        <BookingDetailsCancelButton
          booking={booking}
          onCancel={cancelBooking}
          onTerminate={showArchiveModal}
          fullWidth
        />
        <CancelBookingModal
          visible={cancelModalVisible}
          dismissModal={hideModal}
          booking={booking}
        />
        <ArchiveBookingModal
          visible={archiveModalVisible}
          bookingId={booking.id}
          bookingTitle={offer.name}
          onDismiss={hideArchiveModal}
        />
      </ScrollView>
      {/* BookingDetailsHeader is called after Body to implement the BlurView for iOS */}
      <BookingDetailsHeader headerTransition={headerTransition} title={offer.name} />
    </Container>
  ) : null
}

function getVenueBlockVenue(venue: BookingVenueResponse): VenueBlockVenue {
  return venue
}

function getVenueBlockAddress(
  address: BookingOfferResponseAddress | null | undefined
): VenueBlockAddress | undefined {
  return address ?? undefined
}

const ErrorBannerContainer = styled.View({
  marginHorizontal: getSpacing(6),
  marginTop: getSpacing(8),
})
const StyledSeparator = styled(Separator.Horizontal)({
  marginVertical: getSpacing(8),
  height: getSpacing(2),
})

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const StyledHeaderWithImage = styled(HeaderWithImage)({
  marginBottom: getSpacing(offerImageContainerMarginTop),
})
