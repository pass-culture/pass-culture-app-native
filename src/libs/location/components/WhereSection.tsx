import React from 'react'
import { useQueryClient } from 'react-query'
import styled from 'styled-components/native'

import { Coordinates, OfferVenueResponse, VenueResponse } from 'api/gen'
import { analytics } from 'libs/analytics/provider'
import { SeeItineraryButton } from 'libs/itinerary/components/SeeItineraryButton'
import { getGoogleMapsItineraryUrl } from 'libs/itinerary/openGoogleMapsItinerary'
import { getDistance } from 'libs/location/getDistance'
import { useLocation } from 'libs/location/LocationWrapper'
import { QueryKeys } from 'libs/queryKeys'
import { formatFullAddress } from 'shared/address/addressFormatter'
import { Spacer } from 'ui/components/spacer/Spacer'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ArrowNext as DefaultArrowNext } from 'ui/svg/icons/ArrowNext'
import { BicolorLocationBuilding as LocationBuilding } from 'ui/svg/icons/BicolorLocationBuilding'
import { TypoDS, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  beforeNavigateToItinerary?: () => Promise<void> | void
  venue: OfferVenueResponse | VenueResponse
  address: string
  locationCoordinates: Coordinates
  showVenueBanner?: boolean
}

type PartialVenue = Pick<
  VenueResponse,
  'id' | 'venueTypeCode' | 'name' | 'description' | 'publicName'
>

const mergeVenueData =
  (venue: PartialVenue) =>
  (prevData: VenueResponse | undefined): VenueResponse => ({
    id: venue.id,
    name: venue.publicName || venue.name,
    venueTypeCode: venue.venueTypeCode,
    isVirtual: false,
    description: venue.description,
    accessibility: {},
    contact: {},
    timezone: '',
    ...(prevData || {}),
  })

export const WhereSection: React.FC<Props> = ({
  beforeNavigateToItinerary,
  venue,
  address,
  showVenueBanner,
  locationCoordinates,
}) => {
  const { userLocation, selectedPlace, selectedLocationMode } = useLocation()

  const queryClient = useQueryClient()
  const { latitude: lat, longitude: lng } = locationCoordinates

  const distanceToLocation = getDistance(
    { lat, lng },
    { userLocation, selectedPlace, selectedLocationMode }
  )
  const venueFullAddress = venue.address
    ? formatFullAddress(venue.address, venue.postalCode, venue.city)
    : undefined

  if (distanceToLocation === undefined && venue.address === null) return null

  const onVenuePress = () => {
    // We pre-populate the query-cache with the data from the search result for a smooth transition
    queryClient.setQueryData([QueryKeys.VENUE, venue.id], mergeVenueData(venue))
    analytics.logConsultVenue({ venueId: venue.id, from: 'offer' })
  }

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={6} />
      <TypoDS.Title4 {...getHeadingAttrs(2)}>Où&nbsp;?</TypoDS.Title4>
      {showVenueBanner ? (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />

          <VenueNameContainer
            navigateTo={{ screen: 'Venue', params: { id: venue.id } }}
            onBeforeNavigate={onVenuePress}
            accessibilityLabel={`Lieu ${venue.publicName || venue.name}`}>
            <Spacer.Row numberOfSpaces={2} />
            <IconContainer>
              <LocationBuilding size={iconSize} />
            </IconContainer>
            <Spacer.Row numberOfSpaces={2} />
            <StyledVenueName numberOfLines={1}>{venue.publicName || venue.name}</StyledVenueName>
            <Spacer.Flex />
            <ArrowNext />
          </VenueNameContainer>
        </React.Fragment>
      ) : null}
      {address ? (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <TypoDS.BodyAccentXs>Adresse</TypoDS.BodyAccentXs>
          <Spacer.Column numberOfSpaces={1} />
          <StyledAddress>{address}</StyledAddress>
        </React.Fragment>
      ) : null}
      {distanceToLocation ? (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <TypoDS.BodyAccentXs>Distance</TypoDS.BodyAccentXs>
          <Spacer.Column numberOfSpaces={1} />
          <TypoDS.Body>{distanceToLocation}</TypoDS.Body>
        </React.Fragment>
      ) : null}
      {venueFullAddress ? (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <Separator />
          <Spacer.Column numberOfSpaces={6} />
          <SeeItineraryButton
            externalNav={{
              url: getGoogleMapsItineraryUrl(venueFullAddress),
              address: venueFullAddress,
            }}
            onPress={beforeNavigateToItinerary}
          />
        </React.Fragment>
      ) : null}
      <Spacer.Column numberOfSpaces={6} />
    </React.Fragment>
  )
}

const VenueNameContainer = styled(InternalTouchableLink)({
  flexDirection: 'row',
  alignItems: 'center',
})

const StyledAddress = styled(TypoDS.Body)({
  textTransform: 'capitalize',
})

const iconSize = getSpacing(8)
const iconSpacing = Math.round(iconSize / 5)

const StyledVenueName = styled(TypoDS.BodyAccent)({
  textTransform: 'capitalize',
  flexShrink: 1,
  left: -iconSpacing,
})

const IconContainer = styled.View({
  left: -iconSpacing,
})

const Separator = styled.View(({ theme }) => ({
  height: 1,
  backgroundColor: theme.colors.greyMedium,
}))

const ArrowNext = styled(DefaultArrowNext).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
