import React, { memo } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { SearchBox } from 'features/search/components/SearchBox/SearchBox'
import { SearchView } from 'features/search/types'
import { InputLabel } from 'ui/components/InputLabel/InputLabel'
import { styledInputLabel } from 'ui/components/InputLabel/styledInputLabel'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  searchInputID: string
  searchView?: SearchView
}

export const SearchHeader = memo(function SearchHeader({ searchInputID, searchView }: Props) {
  const subtitle = 'Toutes les offres à portée de main'
  const shouldDisplaySubtitle = !searchView || searchView === SearchView.Landing

  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <SearchBoxContainer>
        <View {...getHeadingAttrs(1)}>
          <StyledTitle1 htmlFor={searchInputID}>Rechercher</StyledTitle1>
        </View>
        {shouldDisplaySubtitle ? <CaptionSubtitle>{subtitle}</CaptionSubtitle> : null}
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

const CaptionSubtitle = styled(Typo.Caption)(({ theme }) => ({
  marginTop: getSpacing(1),
  color: theme.colors.greyDark,
}))
