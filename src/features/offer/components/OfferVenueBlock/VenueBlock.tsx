import React, { ComponentProps, FunctionComponent, useMemo } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { OfferResponseV2 } from 'api/gen'
import { useVenueBlock } from 'features/offer/components/OfferVenueBlock/useVenueBlock'
import { useLocation } from 'libs/location'
import { getDistance } from 'libs/location/getDistance'
import { Tag } from 'ui/components/Tag/Tag'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { VenueInfoHeader } from 'ui/components/VenueInfoHeader/VenueInfoHeader'
import { getSpacing, Spacer } from 'ui/theme'

const VENUE_THUMBNAIL_SIZE = getSpacing(14)

type Props = {
  offer: OfferResponseV2
  onSeeVenuePress?: VoidFunction
}

export function VenueBlock({ onSeeVenuePress, offer }: Readonly<Props>) {
  const { userLocation, selectedPlace, selectedLocationMode } = useLocation()
  const { venue, address } = offer
  const { venueName, venueAddress, isOfferAddressDifferent } = useVenueBlock({
    venue,
    offerAddress: address,
  })

  const { latitude: lat, longitude: lng } = offer.venue.coordinates
  const distance = getDistance({ lat, lng }, { userLocation, selectedPlace, selectedLocationMode })
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
      {distance ? (
        <React.Fragment>
          <Tag label={`à ${distance}`} />
          <Spacer.Column numberOfSpaces={4} />
        </React.Fragment>
      ) : null}

      <TouchableContainer
        navigateTo={{ screen: 'Venue', params: { id: venue.id } }}
        onBeforeNavigate={onSeeVenuePress}>
        <VenueInfoHeader
          title={venueName}
          subtitle={venueAddress}
          imageSize={VENUE_THUMBNAIL_SIZE}
          showArrow={hasVenuePage}
          imageURL={venue.bannerUrl ?? undefined}
        />
      </TouchableContainer>
    </React.Fragment>
  )
}
