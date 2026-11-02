import React, { FunctionComponent, ReactNode } from 'react'
import styled from 'styled-components/native'

import { OfferResponse } from 'api/gen'
import { useMovieCalendar } from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import { NextScreeningButton } from 'features/offer/components/MoviesScreeningCalendar/NextScreeningButton'
import { useOfferCTAButton } from 'features/offer/components/OfferCTAButton/useOfferCTAButton'
import { getVenueBlock } from 'features/offer/components/OfferVenueBlock/getVenueBlock'
import { VenueBlock } from 'features/offer/components/OfferVenueBlock/VenueBlock'
import { getAddress, getVenue } from 'features/offer/helpers/getVenueBlockProps'
import { isDateNotWithinNextNbDays } from 'features/offer/helpers/isDateNotWithinNextNbDays'
import { getDistance } from 'libs/location/getDistance'
import { useUserLocation, usePlace, useLocationMode } from 'libs/locationV2/location.store'
import { useSubcategoriesMapping } from 'libs/subcategories'

type CineBlockOffer = Pick<OfferResponse, 'address' | 'subcategoryId' | 'venue'>

type CineBlockBaseProps = {
  offer: CineBlockOffer
  ctaOffer: OfferResponse
  renderScreenings: (selectedDate: Date) => ReactNode
  onSeeVenuePress?: VoidFunction
  nextDate?: Date
  withDivider?: boolean
}

export const CineBlockBase: FunctionComponent<CineBlockBaseProps> = ({
  offer,
  ctaOffer,
  renderScreenings,
  onSeeVenuePress,
  nextDate,
  withDivider,
}) => {
  const { selectedDate, goToDate } = useMovieCalendar()
  const userLocation = useUserLocation()
  const selectedPlace = usePlace()
  const selectedLocationMode = useLocationMode()
  const subcategoriesMapping = useSubcategoriesMapping()
  const venue = getVenue(offer.venue)
  const distance = venue.coordinates
    ? getDistance(
        { lat: venue.coordinates.latitude, lng: venue.coordinates.longitude },
        { userLocation, selectedPlace, selectedLocationMode },
        offer.subcategoryId
      )
    : null

  const { onPress: onPressOfferCTA, CTAOfferModal } = useOfferCTAButton(
    ctaOffer,
    subcategoriesMapping[offer.subcategoryId]
  )

  const venueBlockAddress = getAddress(offer.address)
  const { venueName, venueAddress, isOfferAddressDifferent } = getVenueBlock({
    venue,
    offerAddress: venueBlockAddress,
  })

  return (
    <React.Fragment>
      <Container>
        <VenueBlock
          venueId={venue.id}
          title={venueName}
          subtitle={venueAddress}
          onSeeVenuePress={onSeeVenuePress}
          venueImageUrl={venue.bannerUrl ?? undefined}
          distance={distance}
          hasVenuePage={!!onSeeVenuePress && !isOfferAddressDifferent}
          isOfferAtSameAddressAsVenue
        />

        {nextDate ? (
          <NextScreeningButton
            date={nextDate}
            onPress={
              isDateNotWithinNextNbDays(new Date(), nextDate, 15)
                ? () => onPressOfferCTA()
                : () => goToDate(nextDate)
            }
          />
        ) : (
          renderScreenings(selectedDate)
        )}
        {CTAOfferModal}
      </Container>
      {withDivider ? <Divider testID="divider" /> : null}
    </React.Fragment>
  )
}

const Container = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
  paddingTop: theme.designSystem.size.spacing.xl,
  gap: theme.designSystem.size.spacing.l,
}))

const Divider = styled.View(({ theme }) => ({
  height: 1,
  backgroundColor: theme.designSystem.color.background.subtle,
  marginHorizontal: theme.isDesktopViewport ? undefined : theme.contentPage.marginHorizontal,
  marginTop: theme.isDesktopViewport
    ? theme.designSystem.size.spacing.xl
    : theme.designSystem.size.spacing.l,
}))
