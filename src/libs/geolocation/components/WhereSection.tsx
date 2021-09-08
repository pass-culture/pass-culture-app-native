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
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { BicolorLocationBuilding as LocationBuilding } from 'ui/svg/icons/BicolorLocationBuilding'
import { Typo, ColorsEnum, getSpacing } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

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
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <VenueNameContainer onPress={navigateToVenuePage} testID="VenueBannerComponent">
            <IconContainer>
              <LocationBuilding size={iconSize} />
            </IconContainer>
            <StyledVenueName numberOfLines={1}>{venue.name}</StyledVenueName>
            <Spacer.Flex />
            <ArrowNext size={getSpacing(6)} />
          </VenueNameContainer>
        </React.Fragment>
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

const VenueNameContainer = styled.TouchableOpacity.attrs({
  activeOpacity: ACTIVE_OPACITY,
})({
  flexDirection: 'row',
  alignItems: 'center',
})

const StyledAddress = styled(Typo.Body)({
  textTransform: 'capitalize',
})

const iconSize = getSpacing(12)
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
