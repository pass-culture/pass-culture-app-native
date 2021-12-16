import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { useQueryClient } from 'react-query'
import styled from 'styled-components/native'

import { Coordinates, OfferVenueResponse, VenueResponse } from 'api/gen'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { useDistance } from 'libs/geolocation/hooks/useDistance'
import { SeeItineraryButton } from 'libs/itinerary/components/SeeItineraryButton'
import useOpenItinerary from 'libs/itinerary/useOpenItinerary'
import { QueryKeys } from 'libs/queryKeys'
import { Spacer } from 'ui/components/spacer/Spacer'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { BicolorLocationBuilding as LocationBuilding } from 'ui/svg/icons/BicolorLocationBuilding'
import { Typo, ColorsEnum, getSpacing } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

type Props = {
  beforeNavigateToItinerary?: () => Promise<void> | void
  venue: OfferVenueResponse | VenueResponse
  address: string
  locationCoordinates: Coordinates
  showVenueBanner?: boolean | false
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
    ...(prevData || {}),
  })

export const WhereSection: React.FC<Props> = ({
  beforeNavigateToItinerary,
  venue,
  address,
  showVenueBanner,
  locationCoordinates,
}) => {
  const queryClient = useQueryClient()
  const navigation = useNavigation<UseNavigationType>()
  const { latitude: lat, longitude: lng } = locationCoordinates
  const distanceToLocation = useDistance({ lat, lng })
  const { canOpenItinerary, openItinerary } = useOpenItinerary(
    venue.address,
    beforeNavigateToItinerary
  )

  if (distanceToLocation === undefined && venue.address === null) return null

  const navigateToVenuePage = () => {
    // We pre-populate the query-cache with the data from the search result for a smooth transition
    queryClient.setQueryData([QueryKeys.VENUE, venue.id], mergeVenueData(venue))
    analytics.logConsultVenue({ venueId: venue.id, from: 'offer' })
    navigation.navigate('Venue', { id: venue.id })
  }

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.Title4>{t`Où\u00a0?`}</Typo.Title4>
      {showVenueBanner ? (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <VenueNameContainer onPress={navigateToVenuePage} testID="VenueBannerComponent">
            <Spacer.Row numberOfSpaces={2} />
            <IconContainer>
              <LocationBuilding size={iconSize} />
            </IconContainer>
            <Spacer.Row numberOfSpaces={2} />
            <StyledVenueName numberOfLines={1}>{venue.publicName || venue.name}</StyledVenueName>
            <Spacer.Flex />
            <ArrowNext size={getSpacing(6)} />
          </VenueNameContainer>
        </React.Fragment>
      ) : null}
      {!!address && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <Typo.Caption>{t`Adresse`}</Typo.Caption>
          <Spacer.Column numberOfSpaces={1} />
          <StyledAddress>{address}</StyledAddress>
        </React.Fragment>
      )}
      {!!distanceToLocation && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <Typo.Caption>{t`Distance`}</Typo.Caption>
          <Spacer.Column numberOfSpaces={1} />
          <Typo.Body>{distanceToLocation}</Typo.Body>
        </React.Fragment>
      )}
      {!!canOpenItinerary && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <Separator />
          <Spacer.Column numberOfSpaces={6} />
          <SeeItineraryButton openItinerary={openItinerary} />
        </React.Fragment>
      )}
      <Spacer.Column numberOfSpaces={6} />
    </React.Fragment>
  )
}

const VenueNameContainer = styled.TouchableOpacity.attrs({
  activeOpacity: ACTIVE_OPACITY,
})({
  flexDirection: 'row',
  alignItems: 'center',
})

const StyledAddress = styled(Typo.Body)({
  textTransform: 'capitalize',
})

const iconSize = getSpacing(8)
const iconSpacing = Math.round(iconSize / 5)

const StyledVenueName = styled(Typo.ButtonText)({
  textTransform: 'capitalize',
  flexShrink: 1,
  left: -iconSpacing,
})

const IconContainer = styled.View({
  left: -iconSpacing,
})

const Separator = styled.View({
  height: 1,
  backgroundColor: ColorsEnum.GREY_MEDIUM,
})
