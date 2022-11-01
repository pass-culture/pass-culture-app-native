import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ThematicHomeHeader } from 'features/home/components/headers/ThematicHomeHeader'
import { getSpacing } from 'ui/theme'

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
  padding: getSpacing(6),
})
