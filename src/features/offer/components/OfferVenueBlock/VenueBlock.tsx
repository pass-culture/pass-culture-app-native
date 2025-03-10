import React, { ComponentProps, FunctionComponent, useMemo } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { VenueBlockAddress, VenueBlockVenue } from 'features/offer/components/OfferVenueBlock/type'
import { useVenueBlock } from 'features/offer/components/OfferVenueBlock/useVenueBlock'
import { useLocation } from 'libs/location'
import { getDistance } from 'libs/location/getDistance'
import { Tag } from 'ui/components/Tag/Tag'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { VenueInfoHeader } from 'ui/components/VenueInfoHeader/VenueInfoHeader'
import { getSpacing } from 'ui/theme'

type Props = {
  venue: VenueBlockVenue
  address?: VenueBlockAddress
  onSeeVenuePress?: VoidFunction
  shouldShowDistances?: boolean
  thumbnailSize?: number
}
const VENUE_THUMBNAIL_SIZE = getSpacing(14)

export function VenueBlock({
  onSeeVenuePress,
  shouldShowDistances = true,
  thumbnailSize,
  address,
  venue,
}: Readonly<Props>) {
  const { userLocation, selectedPlace, selectedLocationMode } = useLocation()
  const { venueName, venueAddress, isOfferAddressDifferent } = useVenueBlock({
    venue,
    offerAddress: address,
  })

  const distance = venue.coordinates
    ? getDistance(
        { lat: venue.coordinates.latitude, lng: venue.coordinates.longitude },
        { userLocation, selectedPlace, selectedLocationMode }
      )
    : null

  const shouldDisplayDistanceTag = shouldShowDistances && distance
  const hasVenuePage = !!onSeeVenuePress && !isOfferAddressDifferent
  const TouchableContainer: FunctionComponent<ComponentProps<typeof InternalTouchableLink>> =
    useMemo(
      () =>
        styled(hasVenuePage ? InternalTouchableLink : View)({
          flexDirection: 'row',
          maxWidth: 500,
        }),
      [hasVenuePage]
    )

  return (
    <React.Fragment>
      {shouldDisplayDistanceTag ? <StyledTag label={`à ${distance}`} /> : null}

      <TouchableContainer
        navigateTo={{ screen: 'Venue', params: { id: venue.id } }}
        onBeforeNavigate={onSeeVenuePress}>
        <VenueInfoHeader
          title={venueName}
          subtitle={venueAddress}
          imageSize={thumbnailSize ?? VENUE_THUMBNAIL_SIZE}
          showArrow={hasVenuePage}
          imageURL={venue.bannerUrl ?? ''}
        />
      </TouchableContainer>
    </React.Fragment>
  )
}

const StyledTag = styled(Tag)({
  marginBottom: getSpacing(4),
})
