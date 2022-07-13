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
  paramsShowResults?: boolean
  searchInputID: string
  onFocusState?: (focus: boolean) => void
  isFocus?: boolean
}

const SearchBoxWithLabel = ({
  searchInputID,
  onFocusState,
  isFocus,
}: Omit<Props, 'paramsShowResults'>) => {
  const { top } = useCustomSafeInsets()

  return (
    <React.Fragment>
      <HeaderBackground height={top + getSpacing(20)} />
      <Spacer.TopScreen />
      <SearchBoxContainer testID="searchBoxWithLabel">
        <View {...getHeadingAttrs(1)}>
          <StyledInputLabel htmlFor={searchInputID}>{t`Recherche une offre`}</StyledInputLabel>
        </View>
        <Spacer.Column numberOfSpaces={2} />
        <FloatingSearchBoxContainer>
          <FloatingSearchBox
            searchInputID={searchInputID}
            onFocusState={onFocusState}
            isFocus={isFocus}
            showLocationButton={true}
          />
        </FloatingSearchBoxContainer>
        <Spacer.Column numberOfSpaces={6} />
      </SearchBoxContainer>
    </React.Fragment>
  )
}

const SearchBoxWithoutLabel = ({
  isFocus,
  onFocusState,
  searchInputID,
}: Omit<Props, 'paramsShowResults'>) => {
  const { top } = useCustomSafeInsets()

  return (
    <React.Fragment>
      {top ? <HeaderBackground height={top} /> : null}
      <Spacer.TopScreen />
      <SearchBoxContainer testID="searchBoxWithoutLabel">
        <SearchBox
          searchInputID={searchInputID}
          onFocusState={onFocusState}
          isFocus={isFocus}
          accessibleHiddenTitle={t`Recherche une offre, un titre, un lieu...`}
        />
      </SearchBoxContainer>
      <Spacer.Column numberOfSpaces={1} />
    </React.Fragment>
  )
}

export const SearchHeader: React.FC<Props> = ({
  paramsShowResults,
  searchInputID,
  onFocusState,
  isFocus,
}) => {
  const showResults = useShowResults()

  return !paramsShowResults && !showResults && !isFocus ? (
    <SearchBoxWithLabel
      searchInputID={searchInputID}
      onFocusState={onFocusState}
      isFocus={isFocus}
    />
  ) : (
    <SearchBoxWithoutLabel
      isFocus={isFocus}
      onFocusState={onFocusState}
      searchInputID={searchInputID}
    />
  )
}

const SearchBoxContainer = styled.View({
  alignSelf: 'center',
  marginTop: getSpacing(6),
  position: 'relative',
  width: '100%',
  paddingHorizontal: getSpacing(6),
  zIndex: 1,
})

const StyledInputLabel = styledInputLabel(InputLabel)(({ theme }) => ({
  ...theme.typography.title4,
  color: theme.colors.white,
}))

const FloatingSearchBoxContainer = styled.View({
  position: 'relative',
})

const FloatingSearchBox = styled(SearchBox)({
  position: 'absolute',
  left: 0,
  right: 0,
})
