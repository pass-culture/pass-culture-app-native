import React, { FunctionComponent } from 'react'
import { View } from 'react-native'

import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { PageHeaderWithoutPlaceholder } from 'ui/components/headers/PageHeaderWithoutPlaceholder'

export const VenueMap: FunctionComponent = () => {
  const { goBack } = useGoBack(...getTabNavConfig('Search'))
  return (
    <View>
      <PageHeaderWithoutPlaceholder
        title="Carte des lieux"
        onGoBack={goBack}
        backgroundColor="rgba(255, 255, 255, 0.8)"
      />
    </View>
  )
}
