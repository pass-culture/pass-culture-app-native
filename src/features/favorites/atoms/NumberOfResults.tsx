import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

const formatNbHits = (nbHits: number) => {
  if (nbHits === 1) return t`${nbHits} favori`
  return t`${nbHits} favoris`
}

export const NumberOfResults: React.FC<{ nbFavorites: number }> = ({ nbFavorites }) => {
  if (!nbFavorites) return <React.Fragment></React.Fragment>
  return (
    <Container>
      <Body>{formatNbHits(nbFavorites)}</Body>
    </Container>
  )
}

const Container = styled.View({
  margin: getSpacing(6),
  marginBottom: getSpacing(4),
})
const Body = styled(Typo.Body)({ color: ColorsEnum.GREY_DARK })
