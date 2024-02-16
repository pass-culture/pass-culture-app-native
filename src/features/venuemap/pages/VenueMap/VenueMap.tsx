import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import {
  PageHeaderWithoutPlaceholder,
  useGetHeaderHeight,
} from 'ui/components/headers/PageHeaderWithoutPlaceholder'

export const VenueMap: FunctionComponent = () => {
  const { goBack } = useGoBack(...getTabNavConfig('Search'))
  const headerHeight = useGetHeaderHeight()

  return (
    <View>
      <PageHeaderWithoutPlaceholder title="Carte des lieux" onGoBack={goBack} />
      <Placeholder height={headerHeight} />
    </View>
  )
}

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
}))
