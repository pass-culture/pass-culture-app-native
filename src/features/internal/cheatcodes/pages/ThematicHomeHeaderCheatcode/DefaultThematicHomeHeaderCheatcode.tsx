import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { DefaultThematicHomeHeader } from 'features/home/components/headers/DefaultThematicHomeHeader'
import { ThematicHomeHeader } from 'features/home/components/headers/ThematicHomeHeader'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'

export const DefaultThematicHomeHeaderCheatcode: FunctionComponent = () => {
  const { headerTransition } = useOpacityTransition()

  return (
    <Container>
      <ThematicHomeHeader headerTransition={headerTransition} title="Le plein de cinéma" />
      <DefaultThematicHomeHeader
        headerTitle="Le plein de cinéma"
        headerSubtitle="La playlist cinéma"
      />
    </Container>
  )
}

const Container = styled.View({
  width: '100%',
  height: '100%',
})
