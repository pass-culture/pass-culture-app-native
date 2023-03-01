import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { HighlightThematicHomeHeader } from 'features/home/components/headers/HighlightThematicHomeHeader'

export const HighlightThematicHomeHeaderCheatcode: FunctionComponent = () => {
  return (
    <Container>
      <HighlightThematicHomeHeader
        imageUrl="https://images.ctfassets.net/2bg01iqy0isv/5PmtxKY77rq0nYpkCFCbrg/4daa8767efa35827f22bb86e5fc65094/photo-lion_noir-et-blanc_laurent-breillat-610x610.jpeg"
        subtitle={'Un sous-titre'}
        title={'Bloc temps fort'}
        beginningDate={new Date('2022-12-21T23:00:00.000Z')}
        endingDate={new Date('2023-01-14T23:00:00.000Z')}
      />
    </Container>
  )
}

const Container = styled.View({
  width: '100%',
  height: '100%',
})
