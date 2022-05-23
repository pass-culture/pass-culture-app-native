import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { useAppSettings } from 'features/auth/settings'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { InputLabel } from 'ui/components/InputLabel/InputLabel'
import { styledInputLabel } from 'ui/components/InputLabel/styledInputLabel'
import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { getSpacing, Spacer } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

import { SearchBox } from './SearchBox'

type SearchHeaderProps = {
  searchInputID: string
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({ searchInputID }) => {
  const { top } = useCustomSafeInsets()
  const { data: appSettings } = useAppSettings()
  const { navigate } = useNavigation<UseNavigationType>()
  const appEnableSearchHomepageRework = appSettings?.appEnableSearchHomepageRework ?? false
  const inputHeight = appEnableSearchHomepageRework ? getSpacing(8) : getSpacing(12)

  return (
    <React.Fragment>
      <HeaderBackgroundWrapper height={top + inputHeight + getSpacing(12)}>
        <HeaderBackground />
      </HeaderBackgroundWrapper>
      <Spacer.TopScreen />
      {appEnableSearchHomepageRework ? (
        <SearchBoxReworkContainer height={inputHeight} testID="searchBoxReworkContainer">
          <StyledInputLabel htmlFor={searchInputID}>{t`Recherche une offre`}</StyledInputLabel>
          <Spacer.Column numberOfSpaces={2} />
          <SearchBox
            searchInputID={searchInputID}
            onFocusSearchInput={() => {
              if (appEnableSearchHomepageRework) navigate('SearchDetails')
            }}
            showLocationBtn={appEnableSearchHomepageRework}
          />
        </SearchBoxReworkContainer>
      ) : (
        <SearchBoxContainer height={inputHeight}>
          <SearchBox
            searchInputID={searchInputID}
            showLocationBtn={appEnableSearchHomepageRework}
          />
        </SearchBoxContainer>
      )}
    </React.Fragment>
  )
}

const SearchBoxContainer = styled.View<{ height: number }>(({ height }) => ({
  alignSelf: 'center',
  height,
  marginVertical: getSpacing(6),
  width: '90%',
}))

const SearchBoxReworkContainer = styled(SearchBoxContainer)({
  position: 'relative',
  zIndex: 1,
})

const HeaderBackgroundWrapper = styled.View<{ height: number }>(({ height, theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  height,
  overflow: 'hidden',
  zIndex: theme.zIndex.background,
}))

const StyledInputLabel = styledInputLabel(InputLabel)(({ theme }) => ({
  ...theme.typography.title4,
  color: theme.colors.white,
}))
