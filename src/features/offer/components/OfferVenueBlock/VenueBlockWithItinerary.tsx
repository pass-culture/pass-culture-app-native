import React from 'react'

import { VenueBlockAddress, VenueBlockVenue } from 'features/offer/components/OfferVenueBlock/type'
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
}

export const VenueBlockWithItinerary = ({
  shouldDisplayItineraryButton,
  offerFullAddress,
  venue,
  address,
  offerId,
  thumbnailSize,
}: Props) => {
  return (
    <React.Fragment>
      {address ? (
        <VenueBlock
          venue={venue}
          address={address}
          shouldShowDistances={false}
          thumbnailSize={thumbnailSize}
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
