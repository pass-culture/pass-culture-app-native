import React from 'react'
import styled from 'styled-components/native'

import { getFavoritesNumberByType } from 'features/favorites/helpers/getFavoritesNumberByType'
import { Tab } from 'features/favorites/types'
import { plural } from 'libs/plural'
import { Typo } from 'ui/theme'
import { setTextSemantic } from 'ui/theme/typographyAttrs/setTextSemantic'

export const NumberOfResults: React.FC<{ nbFavorites: number; tab?: Tab }> = ({
  nbFavorites,
  tab,
}) => {
  if (!nbFavorites) return null
  return (
    <Container hasTab={!!tab}>
      <Caption>
        {tab
          ? getFavoritesNumberByType(nbFavorites, tab)
          : plural(nbFavorites, {
              singular: '# favori',
              plural: '# favoris',
            })}
      </Caption>
    </Container>
  )
}

const Container = styled.View<{ hasTab?: boolean }>(({ theme, hasTab }) => ({
  marginHorizontal: theme.designSystem.size.spacing.xl,
  marginBottom: hasTab ? theme.designSystem.size.spacing.xl : theme.designSystem.size.spacing.l,
  marginTop: hasTab ? theme.designSystem.size.spacing.xxl : undefined,
}))

const Caption = styled(Typo.BodyAccentS).attrs(() => setTextSemantic('h2'))(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
