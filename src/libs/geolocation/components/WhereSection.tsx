import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { Coordinates, OfferVenueResponse, VenueResponse } from 'api/gen'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { useDistance } from 'libs/geolocation/hooks/useDistance'
import { SeeItineraryButton } from 'libs/itinerary/components/SeeItineraryButton'
import useOpenItinerary from 'libs/itinerary/useOpenItinerary'
import { Spacer } from 'ui/components/spacer/Spacer'
import { Typo, ColorsEnum } from 'ui/theme'

type Props = {
  beforeNavigateToItinerary?: () => Promise<void> | void
  venue: OfferVenueResponse | VenueResponse
  address: string | null
  locationCoordinates: Coordinates
  showVenueBanner?: boolean | false
}

export const WhereSection: React.FC<Props> = ({
  beforeNavigateToItinerary,
  venue,
  address,
  showVenueBanner,
  locationCoordinates,
}) => {
  const navigation = useNavigation<UseNavigationType>()
  const { latitude: lat, longitude: lng } = locationCoordinates
  const distanceToLocation = useDistance({ lat, lng })
  const { canOpenItinerary, openItinerary } = useOpenItinerary(lat, lng, beforeNavigateToItinerary)

  if (distanceToLocation === undefined && venue.address === null) return null

  const navigateToVenuePage = () => {
    return navigation.navigate('Venue', { id: venue.id })
  }

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.Title4>{t`Où ?`}</Typo.Title4>
      {/* TODO : Remove testing condition to display the link to venue button */}
      {/* eslint-disable-next-line local-rules/no-string-check-before-component*/}
      {!!env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING && !!showVenueBanner && (
        <VenueName onPress={navigateToVenuePage} testID="VenueBannerComponent">
          <Spacer.Column numberOfSpaces={2} />
          <Typo.Body>{venue.name}</Typo.Body>
        </VenueName>
      )}
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

const StyledAddress = styled(Typo.Body)({
  textTransform: 'capitalize',
})

const Separator = styled.View({
  height: 1,
  backgroundColor: ColorsEnum.GREY_MEDIUM,
})

const VenueName = styled.TouchableOpacity({})
