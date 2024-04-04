import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { VenueMapBlock } from 'features/venueMap/components/VenueMapBlock/VenueMapBlock'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'

const isWeb = Platform.OS === 'web'

export const VenueMapModule = () => {
  const enabledVenueMap = useFeatureFlag(RemoteStoreFeatureFlags.WIP_VENUE_MAP)

  const { hasGeolocPosition, selectedLocationMode } = useLocation()
  const isLocated =
    selectedLocationMode === LocationMode.AROUND_PLACE ||
    (selectedLocationMode === LocationMode.AROUND_ME && hasGeolocPosition)

  const shouldDisplayVenueMap = enabledVenueMap && isLocated && !isWeb

  return shouldDisplayVenueMap ? <StyledVenueMapBlock /> : null
}

const StyledVenueMapBlock = styled(VenueMapBlock)(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
  paddingBottom: theme.home.spaceBetweenModules,
}))
