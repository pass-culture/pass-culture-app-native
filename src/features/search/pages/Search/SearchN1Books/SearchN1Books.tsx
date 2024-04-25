import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { theme } from 'theme'
import { SubcategoryButton } from 'ui/components/buttons/SubcategoryButton/SubcategoryButton'
import { getSpacing } from 'ui/theme'

export const SearchN1Books: FunctionComponent = () => {
  return (
    <Container>
      <SubcategoryButton
        colors={[theme.colors.aquamarineLight, theme.colors.aquamarine]}
        label="Mangas"
      />
      <SubcategoryButton
        colors={[theme.colors.aquamarineLight, theme.colors.aquamarine]}
        label="Société & politique"
      />
      <SubcategoryButton
        colors={[theme.colors.aquamarineLight, theme.colors.aquamarine]}
        label="Texte sur 2 lignes cela revient au meme"
      />
    </Container>
  )
}
const Container = styled.View({
  margin: getSpacing(4),
  width: '100%',
  height: '100%',
  flexDirection: 'row',
  gap: getSpacing(4),
  justifyContent: 'stretch',
  justifyItems: 'stretch',
})
