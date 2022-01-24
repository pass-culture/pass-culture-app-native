import { plural } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { getSpacing, Typo } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
export const NumberOfResults: React.FC<{ nbFavorites: number }> = ({ nbFavorites }) => {
  if (!nbFavorites) return <React.Fragment></React.Fragment>
  return (
    <Container>
      <Body>
        {plural(nbFavorites, {
          one: '# favori',
          other: '# favoris',
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
