import colorAlpha from 'color-alpha'
import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { VenueMapView } from 'features/venuemap/components/VenueMapView/VenueMapView'
import { useTrackMapSeenDuration } from 'features/venuemap/hook/useTrackMapSeenDuration'
import { useTrackSessionDuration } from 'shared/useTrackSessionDuration'
import { BlurHeader } from 'ui/components/headers/BlurHeader'
import {
  PageHeaderWithoutPlaceholder,
  useGetHeaderHeight,
} from 'ui/components/headers/PageHeaderWithoutPlaceholder'

export const VenueMap: FunctionComponent = () => {
  const { goBack } = useGoBack(
    ...getTabNavConfig('SearchStackNavigator', { screen: 'Search', params: undefined })
  )
  const headerHeight = useGetHeaderHeight()

  useTrackMapSessionDuration()

  return (
    <View>
      <StyledHeader title="Carte des lieux" onGoBack={goBack} />
      <VenueMapView padding={{ top: headerHeight, right: 0, bottom: 0, left: 0 }} />
      <BlurHeader height={headerHeight} />
    </View>
  )
}

const StyledHeader = styled(PageHeaderWithoutPlaceholder)(({ theme }) => ({
  backgroundColor: colorAlpha(theme.colors.white, 0.6),
}))
