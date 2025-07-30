import React from 'react'
import styled from 'styled-components/native'

import { plural } from 'libs/plural'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const NumberOfResults: React.FC<{ nbFavorites: number }> = ({ nbFavorites }) => {
  if (!nbFavorites) return null
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

const Container = styled.View(({ theme }) => ({
  marginHorizontal: theme.designSystem.size.spacing.xl,
  marginBottom: theme.designSystem.size.spacing.l,
}))

const Caption = styled(Typo.BodyAccentXs).attrs(() => getHeadingAttrs(2))(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
