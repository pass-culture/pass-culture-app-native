import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

const formatNbHits = (nbHits: number) => {
  if (nbHits === 1) return _(t`${nbHits} résultat`)
  return _(t`${nbHits} résultats`)
}

export const NumberOfResults: React.FC<{ nbHits: number }> = ({ nbHits }) => {
  if (!nbHits) return <React.Fragment></React.Fragment>
  return (
    <Container>
      <Body>{formatNbHits(nbHits)}</Body>
    </Container>
  )
}

const Container = styled.View({
  margin: getSpacing(6),
  marginBottom: getSpacing(0),
})
const Body = styled(Typo.Body)({ color: ColorsEnum.GREY_DARK })
