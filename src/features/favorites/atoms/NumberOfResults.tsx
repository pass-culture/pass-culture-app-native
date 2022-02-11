import { plural } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { getSpacing, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typography'

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

const Body = styled(Typo.Body).attrs(() => getHeadingAttrs(2))(({ theme }) => ({
  color: theme.colors.greyDark,
}))
