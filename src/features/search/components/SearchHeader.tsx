import { t } from '@lingui/macro'
import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { SearchBox } from 'features/search/components/SearchBox'
import { SearchBoxAutocomplete } from 'features/search/components/SearchBoxAutocomplete'
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
  shouldAutocomplete: boolean
  setShouldAutocomplete: (isShowAutocomplete: boolean) => void
  setAutocompleteValue: (query: string) => void
  autocompleteValue: string
}

const SearchBoxWithLabel = ({
  searchInputID,
  appEnableAutocomplete,
  shouldAutocomplete,
  setShouldAutocomplete,
  setAutocompleteValue,
}: Omit<Props, 'paramsShowResults' | 'autocompleteValue'>) => {
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
        {appEnableAutocomplete ? (
          <SearchBoxAutocomplete
            searchInputID={searchInputID}
            isFocus={false}
            shouldAutocomplete={shouldAutocomplete}
            setShouldAutocomplete={setShouldAutocomplete}
            showLocationButton={true}
            setAutocompleteValue={setAutocompleteValue}
          />
        ) : (
          <SearchBox
            searchInputID={searchInputID}
            isFocus={false}
            shouldAutocomplete={shouldAutocomplete}
            setShouldAutocomplete={setShouldAutocomplete}
            showLocationButton={true}
            setAutocompleteValue={setAutocompleteValue}
          />
        )}
      </SearchBoxContainer>
    </React.Fragment>
  )
}

const SearchBoxWithoutLabel = ({
  appEnableAutocomplete,
  shouldAutocomplete,
  setShouldAutocomplete,
  setAutocompleteValue,
  searchInputID,
}: Omit<Props, 'paramsShowResults' | 'autocompleteValue'>) => {
  const { top } = useCustomSafeInsets()
  const showResults = useShowResults()

  return (
    <React.Fragment>
      {top ? <HeaderBackground height={top} /> : null}
      <Spacer.TopScreen />
      <SearchBoxContainer testID="searchBoxWithoutLabel">
        {appEnableAutocomplete ? (
          <SearchBoxAutocomplete
            searchInputID={searchInputID}
            isFocus={!showResults ? true : false}
            shouldAutocomplete={shouldAutocomplete}
            setShouldAutocomplete={setShouldAutocomplete}
            accessibleHiddenTitle={t`Recherche une offre, un titre, un lieu...`}
            setAutocompleteValue={setAutocompleteValue}
          />
        ) : (
          <SearchBox
            searchInputID={searchInputID}
            isFocus={!showResults ? true : false}
            shouldAutocomplete={shouldAutocomplete}
            setShouldAutocomplete={setShouldAutocomplete}
            accessibleHiddenTitle={t`Recherche une offre, un titre, un lieu...`}
            setAutocompleteValue={setAutocompleteValue}
          />
        )}
      </SearchBoxContainer>
    </React.Fragment>
  )
}

export const SearchHeader: React.FC<Props> = ({
  searchInputID,
  appEnableAutocomplete,
  shouldAutocomplete,
  setShouldAutocomplete,
  setAutocompleteValue,
  autocompleteValue,
}) => {
  const showResults = useShowResults()

  return !showResults && !shouldAutocomplete && autocompleteValue === '' ? (
    <SearchBoxWithLabel
      searchInputID={searchInputID}
      appEnableAutocomplete={appEnableAutocomplete}
      shouldAutocomplete={shouldAutocomplete}
      setShouldAutocomplete={setShouldAutocomplete}
      setAutocompleteValue={setAutocompleteValue}
    />
  ) : (
    <SearchBoxWithoutLabel
      searchInputID={searchInputID}
      appEnableAutocomplete={appEnableAutocomplete}
      shouldAutocomplete={shouldAutocomplete}
      setShouldAutocomplete={setShouldAutocomplete}
      setAutocompleteValue={setAutocompleteValue}
    />
  )
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
