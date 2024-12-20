import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { DefaultThematicHomeHeader } from 'features/home/components/headers/DefaultThematicHomeHeader'
import { ThematicHomeHeader } from 'features/home/components/headers/ThematicHomeHeader'
import { CategoryThematicHeader, Color, ThematicHeaderType } from 'features/home/types'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'

export const CheatcodesScreenDefaultThematicHomeHeader: FunctionComponent = () => {
  const { headerTransition, onScroll } = useOpacityTransition()

  const thematicHomeHeader: CategoryThematicHeader = {
    type: ThematicHeaderType.Category,
    title: 'Un titre',
    subtitle: 'Un sous-titre',
    color: Color.SkyBlue,
    imageUrl:
      'https://images.ctfassets.net/2bg01iqy0isv/5PmtxKY77rq0nYpkCFCbrg/4daa8767efa35827f22bb86e5fc65094/photo-lion_noir-et-blanc_laurent-breillat-610x610.jpeg',
  }

  return (
    <React.Fragment>
      <ThematicHomeHeader
        headerTransition={headerTransition}
        thematicHeader={thematicHomeHeader}
        homeId="fakeEntryId"
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
