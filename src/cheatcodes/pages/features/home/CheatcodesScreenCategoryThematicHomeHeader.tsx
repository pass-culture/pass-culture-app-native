import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { CategoryThematicHomeHeader } from 'features/home/components/headers/CategoryThematicHomeHeader'
import { ThematicHomeHeader } from 'features/home/components/headers/ThematicHomeHeader'
import { CategoryThematicHeader, Color, ThematicHeaderType } from 'features/home/types'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'

export const CheatcodesScreenCategoryThematicHomeHeader: FunctionComponent = () => {
  const { headerTransition } = useOpacityTransition()
  const { navigate } = useNavigation<UseNavigationType>()
  const handleBackPress = () => navigate(...homeNavigationConfig)

  const thematicHomeHeader: CategoryThematicHeader = {
    type: ThematicHeaderType.Category,
    title: 'Un titre',
    subtitle: 'Un sous-titre',
    color: Color.SkyBlue,
  }

  return (
    <Container>
      <ThematicHomeHeader
        headerTransition={headerTransition}
        thematicHeader={thematicHomeHeader}
        homeId="fakeEntryId"
        onBackPress={handleBackPress}
      />
      <CategoryThematicHomeHeader
        subtitle={thematicHomeHeader.subtitle}
        title={thematicHomeHeader.title}
        color={thematicHomeHeader.color}
      />
    </Container>
  )
}

const Container = styled.View({
  width: '100%',
  height: '100%',
})
