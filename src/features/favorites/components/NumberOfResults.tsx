import React from 'react'
import styled from 'styled-components/native'

import { plural } from 'libs/plural'
import { getSpacing, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const NumberOfResults: React.FC<{ nbFavorites: number }> = ({ nbFavorites }) => {
  if (!nbFavorites) return <React.Fragment />
  return (
    <Container>
      <Caption>
        {plural(nbFavorites, {
          singular: '# favori',
          plural: '# favoris',
        })}
      </Caption>
    </Container>
  )
}

const Container = styled.View({
  marginHorizontal: getSpacing(6),
  marginBottom: getSpacing(4),
})

const Caption = styled(Typo.Caption).attrs(() => getHeadingAttrs(2))(({ theme }) => ({
  color: theme.colors.greyDark,
}))
