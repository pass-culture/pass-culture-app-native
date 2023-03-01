import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { DefaultThematicHomeHeader } from 'features/home/components/headers/DefaultThematicHomeHeader'

export const DefaultThematicHomeHeaderCheatcode: FunctionComponent = () => {
  return (
    <Container>
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
