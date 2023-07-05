import React, { memo } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { SearchBox } from 'features/search/components/SearchBox/SearchBox'
import { InputLabel } from 'ui/components/InputLabel/InputLabel'
import { styledInputLabel } from 'ui/components/InputLabel/styledInputLabel'
import { getSpacing, Spacer } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  searchInputID: string
}

export const SearchHeader = memo(function SearchHeader({ searchInputID }: Props) {
  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <SearchBoxContainer>
        <View {...getHeadingAttrs(1)}>
          <StyledTitle1 htmlFor={searchInputID}>Recherche une offre</StyledTitle1>
        </View>
        <Spacer.Column numberOfSpaces={4} />
        <View>
          <SearchBox searchInputID={searchInputID} />
        </View>
      </SearchBoxContainer>
    </React.Fragment>
  )
})

const SearchBoxContainer = styled.View({
  marginTop: getSpacing(6),
  zIndex: 1,
  paddingHorizontal: getSpacing(6),
})

const StyledTitle1 = styledInputLabel(InputLabel)(({ theme }) => ({
  ...theme.typography.title1,
}))
