import { t } from '@lingui/macro'
import React from 'react'
import { ScrollView, useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { bookingsWithExternalBookingInformationsSnap } from 'features/bookings/api/bookingsSnapWithExternalBookingInformations'
import { BookingDetailsCancelButton } from 'features/bookings/components/BookingDetailsCancelButton'
import { BookingDetailsHeader } from 'features/bookings/components/BookingDetailsHeader'
import { BookingPropertiesSection } from 'features/bookings/components/BookingPropertiesSection'
import { Ticket } from 'features/bookings/components/SwiperTickets/Ticket'
import { BookingProperties, getBookingProperties } from 'features/bookings/helpers'
import { formatFullAddress } from 'libs/address/useFormatFullAddress'
import { analytics, isCloseToBottom } from 'libs/analytics'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { SeeItineraryButton } from 'libs/itinerary/components/SeeItineraryButton'
import { getGoogleMapsItineraryUrl } from 'libs/itinerary/openGoogleMapsItinerary'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { useHeaderTransition } from 'ui/components/headers/animationHelpers'
import { HeroHeader } from 'ui/components/hero/HeroHeader'
import { blurImageHeight, heroMarginTop } from 'ui/components/hero/useHeroDimensions'
import { Separator } from 'ui/components/Separator'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typography'
import { Helmet } from 'ui/web/global/Helmet'

const getOfferRules = (
  properties: BookingProperties,
  activationCodeFeatureEnabled?: boolean
): string => {
  const { hasActivationCode, isDigital, isPhysical, isEvent } = properties
  if (hasActivationCode && activationCodeFeatureEnabled)
    return t`Ce code est ta preuve d’achat, il te permet d’accéder à ton offre\u00a0! N’oublie pas que tu n’as pas le droit de le revendre ou le céder.`
  if (isDigital)
    return t`Ce code à 6 caractères est ta preuve d’achat\u00a0! N’oublie pas que tu n’as pas le droit de le revendre ou le céder.`
  if (isPhysical || isEvent)
    return t`Tu dois présenter ta carte d’identité et ce code de 6 caractères pour profiter de ta réservation\u00a0! N’oublie pas que tu n’as pas le droit de le revendre ou le céder.`
  return ''
}

const scrollIndicatorInsets = { right: 1 }

const activationCodeFeatureEnabled = true
const booking = bookingsWithExternalBookingInformationsSnap.ongoing_bookings[0]

// TODO(LucasBeneston): remove this file when use a real offer with 2 tickets for PO review
export function SwipperTicketPageTest() {
  const windowHeight = useWindowDimensions().height - blurImageHeight

  const mapping = useSubcategoriesMapping()

  const { venue, id: offerId } = booking?.stock.offer || {}
  const { address, postalCode, city } = venue || {}
  const venueFullAddress = address ? formatFullAddress(address, postalCode, city) : undefined

  const logConsultWholeBooking = useFunctionOnce(
    () => offerId && analytics.logBookingDetailsScrolledToBottom(offerId)
  )

  const { headerTransition, onScroll } = useHeaderTransition({
    listener: ({ nativeEvent }) => {
      if (isCloseToBottom(nativeEvent)) logConsultWholeBooking()
    },
  })

  const { offer } = booking.stock
  const properties = getBookingProperties(booking, mapping[offer.subcategoryId].isEvent)
  const shouldDisplayItineraryButton =
    !!venueFullAddress && (properties.isEvent || (properties.isPhysical && !properties.isDigital))

  const offerRules = getOfferRules(properties, activationCodeFeatureEnabled)

  const cancelBooking = () => 'cancelBooking'
  const onNavigateToOfferPress = () => 'onNavigateToOfferPress'

  const helmetTitle = `${t`Ma réservation pour`} ${booking.stock.offer.name} | pass Culture`
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
        <Ticket booking={booking} activationCodeFeatureEnabled={activationCodeFeatureEnabled} />

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
              <SeeItineraryButton
                externalNav={
                  venueFullAddress
                    ? {
                        url: getGoogleMapsItineraryUrl(venueFullAddress),
                        address: venueFullAddress,
                      }
                    : undefined
                }
                onPress={() =>
                  !!venueFullAddress &&
                  offerId &&
                  analytics.logConsultItinerary({ offerId, from: 'bookingdetails' })
                }
              />
            </React.Fragment>
          )}
          {!!offer.withdrawalDetails && (
            <React.Fragment>
              <Spacer.Column numberOfSpaces={8} />
              <Typo.Title4 {...getHeadingAttrs(2)}>{t`Modalités de retrait`}</Typo.Title4>
              <Spacer.Column numberOfSpaces={4} />
              <Typo.Body testID="withdrawalDetails">{offer.withdrawalDetails}</Typo.Body>
            </React.Fragment>
          )}
          <Spacer.Column numberOfSpaces={8} />
          <TouchableLink
            as={ButtonPrimary}
            testID="Voir le détail de l’offre"
            wording={t`Voir le détail de l’offre`}
            onPress={onNavigateToOfferPress}
            fullWidth
          />
          <Spacer.Column numberOfSpaces={4} />
          <BookingDetailsCancelButton
            booking={booking}
            activationCodeFeatureEnabled={activationCodeFeatureEnabled}
            onCancel={cancelBooking}
            fullWidth
          />
        </ViewWithPadding>
        <Spacer.Column numberOfSpaces={5} />
      </ScrollView>
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
}))

const OfferRules = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
  textAlign: 'center',
}))

const ViewWithPadding = styled.View({
  paddingHorizontal: getSpacing(5),
})
