import { Hit, SearchResponse } from '@algolia/client-search'
import { useRoute } from '@react-navigation/native'
import React from 'react'
import { ScrollViewProps, View } from 'react-native'
import styled from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { NumberOfResults } from 'features/search/components/NumberOfResults/NumberOfResults'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { AlgoliaVenue } from 'libs/algolia'
import { analytics } from 'libs/analytics'
import { useGeolocation } from 'libs/geolocation'
import { Offer } from 'shared/offer/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { InfoBanner } from 'ui/components/InfoBanner'
import { GenericBanner } from 'ui/components/ModuleBanner/GenericBanner'
import { Playlist } from 'ui/components/Playlist'
import { Separator } from 'ui/components/Separator'
import { Touchable } from 'ui/components/touchable/Touchable'
import { BicolorEverywhere as Everywhere } from 'ui/svg/icons/BicolorEverywhere'
import { Error } from 'ui/svg/icons/Error'
import { getSpacing, LENGTH_XS, LENGTH_XXS, Spacer, Typo } from 'ui/theme'

interface SearchListHeaderProps extends ScrollViewProps {
  nbHits: number
  userData: SearchResponse<Offer[]>['userData']
  venues: Hit<AlgoliaVenue>[]
  renderVenueItem: ({
    item,
    height,
    width,
  }: {
    item: AlgoliaVenue
    height: number
    width: number
  }) => React.JSX.Element
}

const VENUE_ITEM_HEIGHT = LENGTH_XXS
const VENUE_ITEM_WIDTH = LENGTH_XS
const keyExtractor = (item: AlgoliaVenue) => item.objectID

export const SearchListHeader: React.FC<SearchListHeaderProps> = ({
  nbHits,
  userData,
  venues,
  renderVenueItem,
}) => {
  const { userPosition: position, showGeolocPermissionModal } = useGeolocation()
  const { params } = useRoute<UseRouteType<'Search'>>()
  const shouldDisplayAvailableUserDataMessage = userData && userData.length > 0
  const unavailableOfferMessage = shouldDisplayAvailableUserDataMessage ? userData[0]?.message : ''
  const venueTitle = shouldDisplayAvailableUserDataMessage
    ? userData[0].venue_playlist_title
    : 'Les lieux culturels'

  const onPress = () => {
    analytics.logActivateGeolocfromSearchResults()
    showGeolocPermissionModal()
  }

  const shouldDisplayGeolocationButton =
    position === null &&
    params?.offerCategories?.[0] !== SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE &&
    nbHits > 0 &&
    !shouldDisplayAvailableUserDataMessage

  const title = 'Les offres'

  return (
    <React.Fragment>
      {!!shouldDisplayGeolocationButton && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={3} />
          <GeolocationButtonContainer
            onPress={onPress}
            accessibilityLabel="Active ta géolocalisation">
            <GenericBanner LeftIcon={LocationIcon}>
              <Typo.ButtonText>Géolocalise-toi</Typo.ButtonText>
              <Spacer.Column numberOfSpaces={1} />
              <Typo.Caption numberOfLines={2}>Pour trouver des offres autour de toi.</Typo.Caption>
            </GenericBanner>
          </GeolocationButtonContainer>
        </React.Fragment>
      )}
      {!!shouldDisplayAvailableUserDataMessage && (
        <BannerOfferNotPresentContainer
          testID="banner-container"
          accessibilityRole={AccessibilityRole.STATUS}
          nbHits={nbHits}>
          <InfoBanner message={unavailableOfferMessage} icon={Error} />
        </BannerOfferNotPresentContainer>
      )}
      {!!venues.length && (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={2} />
          <View>
            <Title>{venueTitle}</Title>
            <NumberOfResults nbHits={venues.length} />
            <Playlist
              data={venues}
              itemHeight={VENUE_ITEM_HEIGHT}
              itemWidth={VENUE_ITEM_WIDTH}
              renderItem={renderVenueItem}
              renderHeader={undefined}
              renderFooter={undefined}
              keyExtractor={keyExtractor}
            />
          </View>
          <Spacer.Column numberOfSpaces={3} />
        </React.Fragment>
      )}
      <StyledSeparator />
      <Spacer.Column numberOfSpaces={5} />
      <Title>{title}</Title>
      <NumberOfResults nbHits={nbHits} />
    </React.Fragment>
  )
}

const GeolocationButtonContainer = styledButton(Touchable)({
  marginLeft: getSpacing(6),
  marginRight: getSpacing(6),
  marginBottom: getSpacing(4),
})

const BannerOfferNotPresentContainer = styled.View<{ nbHits: number }>(({ nbHits }) => ({
  paddingHorizontal: getSpacing(6),
  ...(nbHits > 0 && { paddingBottom: getSpacing(4) }),
}))

const LocationIcon = styled(Everywhere).attrs(({ theme }) => ({
  size: theme.icons.sizes.standard,
}))``

const Title = styled(Typo.Title3)({
  marginHorizontal: getSpacing(6),
})

const StyledSeparator = styled(Separator)({
  width: 'auto',
  marginLeft: getSpacing(6),
  marginRight: getSpacing(6),
})
