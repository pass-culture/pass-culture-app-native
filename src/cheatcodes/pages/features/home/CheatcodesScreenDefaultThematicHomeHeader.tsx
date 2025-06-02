import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { DefaultThematicHomeHeader } from 'features/home/components/headers/DefaultThematicHomeHeader'
import { ThematicHomeHeader } from 'features/home/components/headers/ThematicHomeHeader'
import { CategoryThematicHeader, Color, ThematicHeaderType } from 'features/home/types'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'

export const CheatcodesScreenDefaultThematicHomeHeader: FunctionComponent = () => {
  const { headerTransition, onScroll } = useOpacityTransition()
  const { navigate } = useNavigation<UseNavigationType>()
  const handleBackPress = () => navigate(...homeNavConfig)

  const thematicHomeHeader: CategoryThematicHeader = {
    type: ThematicHeaderType.Category,
    title: 'Un titre',
    subtitle: 'Un sous-titre',
    color: Color.SkyBlue,
  }

  return (
    <React.Fragment>
      <ThematicHomeHeader
        headerTransition={headerTransition}
        thematicHeader={thematicHomeHeader}
        homeId="fakeEntryId"
        onBackPress={handleBackPress}
      />
      <Container onScroll={onScroll} scrollEventThrottle={16}>
        <DefaultThematicHomeHeader
          headerTitle="Le plein de cinéma"
          headerSubtitle="La playlist cinéma"
        />
        <MockedContent />
      </Container>
    </React.Fragment>
  )
}

const Container = styled.ScrollView({
  width: '100%',
  height: '100%',
})

const MockedContent = styled.View({ height: 1000 })
