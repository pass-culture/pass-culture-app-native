import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ThematicHomeHeader } from 'features/home/components/headers/ThematicHomeHeader'

export const ThematicHomeHeaderCheatcode: FunctionComponent = () => {
  return (
    <Container>
      <ThematicHomeHeader headerTitle="Le plein de cinéma" headerSubtitle="La playlist cinéma" />
    </Container>
  )
}

const Container = styled.View({
  width: '100%',
  height: '100%',
})
