import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { HighlightThematicHomeHeader } from 'features/home/components/headers/HighlightThematicHomeHeader'
import { ThematicHomeHeader } from 'features/home/components/headers/ThematicHomeHeader'
import { CategoryThematicHeader, Color, ThematicHeaderType } from 'features/home/types'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'

export const CheatcodesScreenHighlightThematicHomeHeader: FunctionComponent = () => {
  const { headerTransition } = useOpacityTransition()
  const { navigate } = useNavigation<UseNavigationType>()
  const handleBackPress = () => navigate(...homeNavigationConfig)

  const thematicHomeHeader: CategoryThematicHeader = {
    type: ThematicHeaderType.Category,
    title: 'Bloc temps fort',
    subtitle: 'Un sous-titre',
    color: Color.SkyBlue,
    imageUrl:
      'https://images.ctfassets.net/2bg01iqy0isv/5PmtxKY77rq0nYpkCFCbrg/4daa8767efa35827f22bb86e5fc65094/photo-lion_noir-et-blanc_laurent-breillat-610x610.jpeg',
  }

  return (
    <Container>
      <ThematicHomeHeader
        headerTransition={headerTransition}
        thematicHeader={thematicHomeHeader}
        homeId="fakeEntryId"
        onBackPress={handleBackPress}
      />
      <HighlightThematicHomeHeader
        imageUrl={thematicHomeHeader.imageUrl}
        subtitle={thematicHomeHeader.subtitle}
        title={thematicHomeHeader.title}
        beginningDate={new Date('2022-12-21T23:00:00.000Z')}
        endingDate={new Date('2023-01-14T23:00:00.000Z')}
        introductionTitle="Titre ou phrase inspirante qui initie le temps fort"
        introductionParagraph={
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...Ipsum has been the industry's standard dummy text ever since the 1500s..."
        }
      />
    </Container>
  )
}

const Container = styled.View({
  width: '100%',
  height: '100%',
})
