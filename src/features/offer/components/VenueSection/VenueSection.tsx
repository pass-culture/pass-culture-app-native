import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { View } from 'react-native'
import { useQueryClient } from 'react-query'

import { OfferVenueResponse, VenueResponse } from 'api/gen'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { formatFullAddressStartsWithPostalCode } from 'libs/address/useFormatFullAddress'
import { analytics } from 'libs/analytics'
import { useDistance } from 'libs/geolocation/hooks/useDistance'
import { SeeItineraryButton } from 'libs/itinerary/components/SeeItineraryButton'
import { getGoogleMapsItineraryUrl } from 'libs/itinerary/openGoogleMapsItinerary'
import { QueryKeys } from 'libs/queryKeys'
import { Separator } from 'ui/components/Separator'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

import { VenueCard } from '../VenueCard/VenueCard'
import { VenueDetails } from '../VenueDetails/VenueDetails'

type Props = {
  beforeNavigateToItinerary?: () => Promise<void> | void
  venue: OfferVenueResponse
  title: string
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
    ...(prevData ?? {}),
  })

export function VenueSection({
  beforeNavigateToItinerary,
  venue,
  showVenueBanner,
  title,
}: Readonly<Props>) {
  const { navigate } = useNavigation<UseNavigationType>()
  const queryClient = useQueryClient()
  const { latitude: lat, longitude: lng } = venue.coordinates
  const distanceToLocation = useDistance({ lat, lng })
  const venueFullAddress = formatFullAddressStartsWithPostalCode(
    venue.address,
    venue.postalCode,
    venue.city
  )
  const shouldDisplaySeeItineraryButton = Boolean(venue.address && venue.postalCode && venue.city)

  const onVenuePress = useCallback(() => {
    // We pre-populate the query-cache with the data from the search result for a smooth transition
    queryClient.setQueryData([QueryKeys.VENUE, venue.id], mergeVenueData(venue))
    analytics.logConsultVenue({ venueId: venue.id, from: 'offer' })
    navigate('Venue', { id: venue.id })
  }, [navigate, queryClient, venue])

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.Title3 {...getHeadingAttrs(2)}>{title}</Typo.Title3>
      {showVenueBanner ? (
        <View>
          <Spacer.Column numberOfSpaces={6} />
          <VenueCard
            title={venue.publicName || venue.name}
            address={venueFullAddress}
            onPress={onVenuePress}
            distance={distanceToLocation}
          />
          <Spacer.Column numberOfSpaces={1} />
        </View>
      ) : (
        <View testID="venue-info">
          <Spacer.Column numberOfSpaces={4} />
          <Separator.Horizontal />
          <Spacer.Column numberOfSpaces={4} />
          <VenueDetails
            title={venue.publicName || venue.name}
            address={venueFullAddress}
            distance={distanceToLocation}
          />
          <Spacer.Column numberOfSpaces={4} />
          <Separator.Horizontal />
          <Spacer.Column numberOfSpaces={1} />
        </View>
      )}
      {!!shouldDisplaySeeItineraryButton && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <SeeItineraryButton
            externalNav={{
              url: getGoogleMapsItineraryUrl(venueFullAddress),
              address: venueFullAddress,
            }}
            onPress={beforeNavigateToItinerary}
          />
        </React.Fragment>
      )}
      <Spacer.Column numberOfSpaces={6} />
    </React.Fragment>
  )
}
