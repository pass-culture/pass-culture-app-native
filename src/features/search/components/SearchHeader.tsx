import React, { memo } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { SearchBox } from 'features/search/components/SearchBox'
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
          <StyledTitle4 htmlFor={searchInputID}>Recherche une offre</StyledTitle4>
        </View>
        <Spacer.Column numberOfSpaces={2} />
        <View>
          <SearchBox searchInputID={searchInputID} />
        </View>
        <Spacer.Column numberOfSpaces={3} />
      </SearchBoxContainer>
    </React.Fragment>
  )
})

const SearchBoxContainer = styled.View({
  marginTop: getSpacing(6),
  zIndex: 1,
  paddingHorizontal: getSpacing(6),
})

const StyledTitle4 = styledInputLabel(InputLabel)(({ theme }) => ({
  ...theme.typography.title4,
}))
