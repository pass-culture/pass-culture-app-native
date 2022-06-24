import { t } from '@lingui/macro'
import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { SearchBoxAutocomplete } from 'features/search/components/SearchBoxAutocomplete'
import { SearchBoxRework } from 'features/search/components/SearchBoxRework'
import { useShowResults } from 'features/search/pages/useShowResults'
import { InputLabel } from 'ui/components/InputLabel/InputLabel'
import { styledInputLabel } from 'ui/components/InputLabel/styledInputLabel'
import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { getSpacing, Spacer } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

type Props = {
  searchInputID: string
  appEnableAutocomplete: boolean
  isShowAutocomplete: boolean
  isSetShowAutocomplete: (isShowAutocomple: boolean) => void
  setAutocompleteValue: (query: string) => void
  autocompleteValue: string
}

export const SearchHeaderRework: React.FC<Props> = ({
  searchInputID,
  appEnableAutocomplete,
  isSetShowAutocomplete,
  isShowAutocomplete,
  setAutocompleteValue,
  autocompleteValue,
}) => {
  const { top } = useCustomSafeInsets()
  const showResults = useShowResults()

  const searchBoxWithLabel = () => {
    return (
      <React.Fragment>
        <HeaderBackgroundWrapperWithLabel height={top + getSpacing(20)}>
          <HeaderBackground />
        </HeaderBackgroundWrapperWithLabel>
        <Spacer.TopScreen />
        <SearchBoxContainer testID="searchBoxWithLabel">
          <View {...getHeadingAttrs(1)}>
            <StyledInputLabel htmlFor={searchInputID}>{t`Recherche une offre`}</StyledInputLabel>
          </View>
          <Spacer.Column numberOfSpaces={2} />
          {appEnableAutocomplete ? (
            <SearchBoxAutocomplete
              searchInputID={searchInputID}
              isFocus={false}
              isSetShowAutocomplete={isSetShowAutocomplete}
              isShowAutocomplete={isShowAutocomplete}
              showLocationButton={true}
              setAutocompleteValue={setAutocompleteValue}
            />
          ) : (
            <SearchBoxRework
              searchInputID={searchInputID}
              isFocus={false}
              isSetShowAutocomplete={isSetShowAutocomplete}
              isShowAutocomplete={isShowAutocomplete}
              showLocationButton={true}
              setAutocompleteValue={setAutocompleteValue}
            />
          )}
        </SearchBoxContainer>
      </React.Fragment>
    )
  }

  const searchBoxWithoutLabel = () => {
    return (
      <React.Fragment>
        <HeaderBackgroundWrapperWithoutLabel maxHeight={top}>
          <HeaderBackground />
        </HeaderBackgroundWrapperWithoutLabel>
        <SearchBoxContainer testID="searchBoxWithoutLabel">
          {appEnableAutocomplete ? (
            <SearchBoxAutocomplete
              searchInputID={searchInputID}
              isFocus={!showResults ? true : false}
              isSetShowAutocomplete={isSetShowAutocomplete}
              isShowAutocomplete={isShowAutocomplete}
              accessibleHiddenTitle={t`Recherche une offre, un titre, un lieu...`}
              setAutocompleteValue={setAutocompleteValue}
            />
          ) : (
            <SearchBoxRework
              searchInputID={searchInputID}
              isFocus={!showResults ? true : false}
              isSetShowAutocomplete={isSetShowAutocomplete}
              isShowAutocomplete={isShowAutocomplete}
              accessibleHiddenTitle={t`Recherche une offre, un titre, un lieu...`}
              setAutocompleteValue={setAutocompleteValue}
            />
          )}
        </SearchBoxContainer>
      </React.Fragment>
    )
  }

  return !showResults && !isShowAutocomplete && autocompleteValue === ''
    ? searchBoxWithLabel()
    : searchBoxWithoutLabel()
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

const HeaderBackgroundWrapperWithLabel = styled.View<{ height: number }>(({ height, theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  height,
  overflow: 'hidden',
  zIndex: theme.zIndex.background,
}))

const HeaderBackgroundWrapperWithoutLabel = styled.View<{ maxHeight: number }>(({ maxHeight }) => ({
  overflow: 'hidden',
  position: 'relative',
  maxHeight,
}))

const StyledInputLabel = styledInputLabel(InputLabel)(({ theme }) => ({
  ...theme.typography.title4,
  color: theme.colors.white,
}))
