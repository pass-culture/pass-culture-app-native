import { useRoute } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { ScrollViewProps } from 'react-native'
import styled from 'styled-components/native'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useSearchResults } from 'features/search/api/useSearchResults/useSearchResults'
import { NumberOfResults } from 'features/search/components/NumberOfResults/NumberOfResults'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { analytics } from 'libs/firebase/analytics'
import { useGeolocation } from 'libs/geolocation'
import { Banner } from 'ui/components/Banner'
import { styledButton } from 'ui/components/buttons/styledButton'
import { GenericBanner } from 'ui/components/ModuleBanner/GenericBanner'
import { Touchable } from 'ui/components/touchable/Touchable'
import { BicolorEverywhere as Everywhere } from 'ui/svg/icons/BicolorEverywhere'
import { Error } from 'ui/svg/icons/Error'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export interface SearchListHeaderProps extends ScrollViewProps {
  nbHits: number
}

export const SearchListHeader: React.FC<SearchListHeaderProps> = ({ nbHits }) => {
  const { position, showGeolocPermissionModal } = useGeolocation()
  const { userData } = useSearchResults()
  const { params } = useRoute<UseRouteType<'Search'>>()
  const shouldDisplayUnavailableOfferMessage = userData && userData.length > 0
  const unavailableOfferMessage = shouldDisplayUnavailableOfferMessage ? userData[0]?.message : ''

  const logActivateGeolocfromSearchResults = useCallback(() => {
    analytics.logActivateGeolocfromSearchResults()
  }, [])

  const onPress = () => {
    logActivateGeolocfromSearchResults()
    showGeolocPermissionModal()
  }

  const shouldDisplayGeolocationButton =
    position === null &&
    params?.offerCategories?.[0] !== SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE &&
    nbHits > 0 &&
    !shouldDisplayUnavailableOfferMessage

  return (
    <React.Fragment>
      <NumberOfResults nbHits={nbHits} />
      {!!shouldDisplayGeolocationButton && (
        <GeolocationButtonContainer
          onPress={onPress}
          accessibilityLabel="Active ta géolocalisation">
          <GenericBanner LeftIcon={LocationIcon}>
            <Typo.ButtonText>Géolocalise-toi</Typo.ButtonText>
            <Spacer.Column numberOfSpaces={1} />
            <Typo.Caption numberOfLines={2}>Pour trouver des offres autour de toi.</Typo.Caption>
          </GenericBanner>
        </GeolocationButtonContainer>
      )}
      {!!shouldDisplayUnavailableOfferMessage && (
        <BannerOfferNotPresentContainer
          testID="banner-container"
          accessibilityRole={AccessibilityRole.STATUS}
          nbHits={nbHits}>
          <Banner message={unavailableOfferMessage} icon={Error} />
        </BannerOfferNotPresentContainer>
      )}
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
  ...(nbHits > 0 ? { paddingBottom: getSpacing(4) } : {}),
}))

const LocationIcon = styled(Everywhere).attrs(({ theme }) => ({
  size: theme.icons.sizes.standard,
}))``
