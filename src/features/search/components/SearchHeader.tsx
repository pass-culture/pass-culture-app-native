import { t } from '@lingui/macro'
import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { SearchBox } from 'features/search/components/SearchBox'
import { useShowResults } from 'features/search/pages/useShowResults'
import { InputLabel } from 'ui/components/InputLabel/InputLabel'
import { styledInputLabel } from 'ui/components/InputLabel/styledInputLabel'
import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { getSpacing, Spacer } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

type Props = {
  searchInputID: string
  onFocusState?: (focus: boolean) => void
  isFocus?: boolean
}

export const SearchHeader: React.FC<Props> = ({ searchInputID, onFocusState, isFocus }) => {
  const { top } = useCustomSafeInsets()
  const showResults = useShowResults()

  const searchBoxWithLabel = () => {
    return (
      <React.Fragment>
        <HeaderBackground height={top + getSpacing(20)} />
        <Spacer.TopScreen />
        <SearchBoxContainer testID="searchBoxWithLabel">
          <View {...getHeadingAttrs(1)}>
            <StyledInputLabel htmlFor={searchInputID}>{t`Recherche une offre`}</StyledInputLabel>
          </View>
          <Spacer.Column numberOfSpaces={2} />
          <SearchBox
            searchInputID={searchInputID}
            onFocusState={onFocusState}
            isFocus={isFocus}
            showLocationButton={true}
          />
        </SearchBoxContainer>
      </React.Fragment>
    )
  }

  // If top is equal to 0, the Header Background will be displayed with its default size
  const headerBackground = top ? <HeaderBackground height={top} /> : null

  const searchBoxWithoutLabel = () => {
    return (
      <React.Fragment>
        {headerBackground}
        <Spacer.TopScreen />
        <SearchBoxContainer testID="searchBoxWithoutLabel">
          <SearchBox
            searchInputID={searchInputID}
            onFocusState={onFocusState}
            isFocus={isFocus}
            accessibleHiddenTitle={t`Recherche une offre, un titre, un lieu...`}
          />
        </SearchBoxContainer>
      </React.Fragment>
    )
  }

  return !showResults && !isFocus ? searchBoxWithLabel() : searchBoxWithoutLabel()
}

const SearchBoxContainer = styled.View({
  alignSelf: 'center',
  height: getSpacing(8),
  marginVertical: getSpacing(6),
  position: 'relative',
  width: '100%',
  paddingHorizontal: getSpacing(6),
  zIndex: 1,
})

const StyledInputLabel = styledInputLabel(InputLabel)(({ theme }) => ({
  ...theme.typography.title4,
  color: theme.colors.white,
}))
