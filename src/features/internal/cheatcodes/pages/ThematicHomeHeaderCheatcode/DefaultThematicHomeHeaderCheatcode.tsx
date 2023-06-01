import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { DefaultThematicHomeHeader } from 'features/home/components/headers/DefaultThematicHomeHeader'
import { DefaultThematicHomeSubHeader } from 'features/home/components/headers/DefaultThematicHomeSubHeader'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'

export const DefaultThematicHomeHeaderCheatcode: FunctionComponent = () => {
  const { headerTransition } = useOpacityTransition()

  return (
    <Container>
      <DefaultThematicHomeHeader
        headerTitle="Le plein de cinéma"
        headerTransition={headerTransition}
      />
      <DefaultThematicHomeSubHeader
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
