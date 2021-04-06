import { plural } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

export const NumberOfResults: React.FC<{ nbHits: number }> = ({ nbHits }) => {
  if (!nbHits) return <React.Fragment></React.Fragment>
  return (
    <Container>
      <Body>
        {plural(nbHits, {
          one: '# résultat',
          other: '# résultats',
        })}
      </Body>
    </Container>
  )
}

const Container = styled.View({
  margin: getSpacing(6),
  marginBottom: getSpacing(4),
})
const Body = styled(Typo.Body)({ color: ColorsEnum.GREY_DARK })
