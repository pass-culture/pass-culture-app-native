import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { CategoryThematicHomeHeader } from 'features/home/components/headers/CategoryThematicHomeHeader'
import { ThematicHomeHeader } from 'features/home/components/headers/ThematicHomeHeader'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'

export const CategoryThematicHomeHeaderCheatcode: FunctionComponent = () => {
  const { headerTransition } = useOpacityTransition()

  return (
    <Container>
      <ThematicHomeHeader headerTransition={headerTransition} title={'un titre'} />
      <CategoryThematicHomeHeader
        imageUrl="https://images.ctfassets.net/2bg01iqy0isv/5PmtxKY77rq0nYpkCFCbrg/4daa8767efa35827f22bb86e5fc65094/photo-lion_noir-et-blanc_laurent-breillat-610x610.jpeg"
        subtitle={'Un sous-titre'}
        title={'Un titre'}
      />
    </Container>
  )
}

const Container = styled.View({
  width: '100%',
  height: '100%',
})
