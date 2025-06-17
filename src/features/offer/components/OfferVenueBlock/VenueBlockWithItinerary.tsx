import React from 'react'

import { BookingVenueResponseV2 } from 'api/gen'
import { BookingProperties } from 'features/bookings/types'
import { VenueBlockAddress } from 'features/offer/components/OfferVenueBlock/type'
import { useVenueBlock } from 'features/offer/components/OfferVenueBlock/useVenueBlock'
import { VenueBlock } from 'features/offer/components/OfferVenueBlock/VenueBlock'
import { analytics } from 'libs/analytics/provider'
import { SeeItineraryButton } from 'libs/itinerary/components/SeeItineraryButton'
import { getGoogleMapsItineraryUrl } from 'libs/itinerary/openGoogleMapsItinerary'

type Props = {
  offerId: number
  properties: BookingProperties
  offerFullAddress?: string
  venue: BookingVenueResponseV2
  address?: VenueBlockAddress
  thumbnailSize: number
  onSeeVenuePress?: VoidFunction
  addressLabel?: string
}

export const VenueBlockWithItinerary = ({
  offerId,
  properties,
  offerFullAddress,
  venue,
  thumbnailSize,
  address,
  onSeeVenuePress,
  addressLabel,
}: Props) => {
  const { venueName, venueAddress, isOfferAddressDifferent } = useVenueBlock({
    venue,
    offerAddress: address,
  })

  const shouldDisplayItineraryButton =
    !!offerFullAddress && (properties.isEvent || (properties.isPhysical && !properties.isDigital))

  return (
    <React.Fragment>
      {address ? (
        <VenueBlock
          venueId={venue.id}
          shouldShowDistances={false}
          hasVenuePage={!!onSeeVenuePress && !isOfferAddressDifferent}
          onSeeVenuePress={onSeeVenuePress}
          title={isOfferAddressDifferent ? addressLabel : venueName}
          subtitle={venueAddress}
          thumbnailSize={thumbnailSize}
          venueImageUrl={venue.bannerUrl ?? undefined}
        />
      ) : null}
      {shouldDisplayItineraryButton ? (
        <SeeItineraryButton
          externalNav={{
            url: getGoogleMapsItineraryUrl(offerFullAddress),
            address: offerFullAddress,
          }}
          onPress={() =>
            offerId && analytics.logConsultItinerary({ offerId, from: 'bookingdetails' })
          }
        />
      ) : null}
    </React.Fragment>
  )
}
