import colorAlpha from 'color-alpha'
import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { Map } from 'features/venuemap/components/Map/Map'
import { PageHeaderWithoutPlaceholder } from 'ui/components/headers/PageHeaderWithoutPlaceholder'

export const VenueMap: FunctionComponent = () => {
  const { goBack } = useGoBack(...getTabNavConfig('Search'))

  return (
    <View>
      <StyledHeader title="Carte des lieux" onGoBack={goBack} />
      <Map />
    </View>
  )
}

const StyledHeader = styled(PageHeaderWithoutPlaceholder)(({ theme }) => ({
  backgroundColor: colorAlpha(theme.colors.white, 0.8),
}))
