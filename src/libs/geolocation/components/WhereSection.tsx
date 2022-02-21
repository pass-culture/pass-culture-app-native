import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { StyleSheet } from 'react-native'
import { useQueryClient } from 'react-query'
import webStyled from 'styled-components'
import styled from 'styled-components/native'

import { Coordinates, OfferVenueResponse, VenueResponse } from 'api/gen'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { useDistance } from 'libs/geolocation/hooks/useDistance'
import { SeeItineraryButton } from 'libs/itinerary/components/SeeItineraryButton'
import { getGoogleMapsItineraryUrl } from 'libs/itinerary/openGoogleMapsItinerary'
import useOpenItinerary from 'libs/itinerary/useOpenItinerary'
import { QueryKeys } from 'libs/queryKeys'
import { GLOBAL_STALE_TIME } from 'libs/react-query/queryClient'
import { Spacer } from 'ui/components/spacer/Spacer'
import { ArrowNext as DefaultArrowNext } from 'ui/svg/icons/ArrowNext'
import { BicolorLocationBuilding as LocationBuilding } from 'ui/svg/icons/BicolorLocationBuilding'
import { Typo, getSpacing } from 'ui/theme'
import { A } from 'ui/web/link/A'
import { Link } from 'ui/web/link/Link'
import { Dd } from 'ui/web/list/Dd'
import { Dt } from 'ui/web/list/Dt'

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
    queryClient.setQueryData([QueryKeys.VENUE, venue.id], mergeVenueData(venue), {
      // Make sure the data is stale, so that it is considered as a placeholder
      updatedAt: Date.now() - (GLOBAL_STALE_TIME + 1),
    })
    analytics.logConsultVenue({ venueId: venue.id, from: 'offer' })
    navigation.navigate('Venue', { id: venue.id })
  }

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={6} />
      <SectionTitle>{t`Où\u00a0?`}</SectionTitle>
      <Dd>
        {showVenueBanner ? (
          <React.Fragment>
            <Spacer.Column numberOfSpaces={4} />
            <Link
              to={{ screen: 'Venue', params: { id: venue.id } }}
              style={styles.link}
              accessible={false}>
              <VenueNameContainer onPress={navigateToVenuePage} testID="VenueBannerComponent">
                <Spacer.Row numberOfSpaces={2} />
                <IconContainer>
                  <LocationBuilding size={iconSize} />
                </IconContainer>
                <Spacer.Row numberOfSpaces={2} />
                <StyledVenueName numberOfLines={1}>
                  {venue.publicName || venue.name}
                </StyledVenueName>
                <Spacer.Flex />
                <ArrowNext />
              </VenueNameContainer>
            </Link>
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
            <A href={venue.address ? getGoogleMapsItineraryUrl(venue.address) : undefined}>
              <SeeItineraryButton openItinerary={openItinerary} />
            </A>
          </React.Fragment>
        )}
      </Dd>
      <Spacer.Column numberOfSpaces={6} />
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  link: {
    flexDirection: 'column',
    display: 'flex',
  },
})

const VenueNameContainer = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))({
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

const Separator = styled.View(({ theme }) => ({
  height: 1,
  backgroundColor: theme.colors.greyMedium,
}))

const SectionTitle = webStyled(Dt)(({ theme }) => ({
  ...theme.typography.title4,
  color: theme.colors.black,
}))

const ArrowNext = styled(DefaultArrowNext).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
