import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { DefaultThematicHomeHeader } from 'features/home/components/headers/DefaultThematicHomeHeader'
import { ThematicHomeHeader } from 'features/home/components/headers/ThematicHomeHeader'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'

export const DefaultThematicHomeHeaderCheatcode: FunctionComponent = () => {
  const { headerTransition, onScroll } = useOpacityTransition()

  return (
    <React.Fragment>
      <ThematicHomeHeader headerTransition={headerTransition} title="Le plein de cinéma" />
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
