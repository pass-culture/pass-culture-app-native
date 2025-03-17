import React from 'react'

import { VenueBlockAddress, VenueBlockVenue } from 'features/offer/components/OfferVenueBlock/type'
import { useVenueBlock } from 'features/offer/components/OfferVenueBlock/useVenueBlock'
import { VenueBlock } from 'features/offer/components/OfferVenueBlock/VenueBlock'
import { analytics } from 'libs/analytics/provider'
import { SeeItineraryButton } from 'libs/itinerary/components/SeeItineraryButton'
import { getGoogleMapsItineraryUrl } from 'libs/itinerary/openGoogleMapsItinerary'

type Props = {
  offerId: number
  shouldDisplayItineraryButton?: boolean
  offerFullAddress?: string
  venue: VenueBlockVenue
  address?: VenueBlockAddress
  thumbnailSize: number
  distance?: string | null
}

export const VenueBlockWithItinerary = ({
  shouldDisplayItineraryButton,
  offerFullAddress,
  venue,
  address,
  offerId,
  thumbnailSize,
  distance,
}: Props) => {
  const { venueName, venueAddress } = useVenueBlock({
    venue,
    offerAddress: address,
  })

  return (
    <React.Fragment>
      {address ? (
        <VenueBlock
          venueId={venue.id}
          title={venueName}
          subtitle={venueAddress}
          shouldShowDistances={false}
          thumbnailSize={thumbnailSize}
          venueImageUrl={venue.bannerUrl ?? ''}
          distance={distance}
        />
      ) : null}
      {shouldDisplayItineraryButton && offerFullAddress ? (
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
