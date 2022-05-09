import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useAppSettings } from 'features/auth/settings'
import { InputLabel } from 'ui/components/InputLabel'
import { styledInputLabel } from 'ui/components/styledInputLabel'
import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { getSpacing, Spacer } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

import { SearchBox } from './SearchBox'

export const SearchHeader: React.FC = () => {
  const { top } = useCustomSafeInsets()
  const { data: appSettings } = useAppSettings()
  const marginTop = getSpacing(6)
  const marginBottom = getSpacing(6)
  const searchInputID = uuidv4()

  const appEnableSearchHomepageRework =
    appSettings?.appEnableSearchHomepageRework !== undefined
      ? appSettings?.appEnableSearchHomepageRework
      : true
  const inputHeight = appEnableSearchHomepageRework ? getSpacing(8) : getSpacing(12)

  return (
    <React.Fragment>
      <HeaderBackgroundWrapper height={top + inputHeight + marginTop + marginBottom}>
        <HeaderBackground />
      </HeaderBackgroundWrapper>
      <Spacer.TopScreen />
      {appEnableSearchHomepageRework ? (
        <SearchBoxReworkContainer
          marginTop={marginTop}
          marginBottom={marginBottom}
          height={inputHeight}
          testID="searchBoxReworkContainer">
          <StyledInputLabel htmlFor={searchInputID}>{t`Recherche une offre`}</StyledInputLabel>
          <Spacer.Column numberOfSpaces={2} />
          <SearchBox searchInputID={searchInputID} />
        </SearchBoxReworkContainer>
      ) : (
        <SearchBoxContainer marginTop={marginTop} marginBottom={marginBottom} height={inputHeight}>
          <SearchBox searchInputID={searchInputID} />
        </SearchBoxContainer>
      )}
    </React.Fragment>
  )
}

const SearchBoxContainer = styled.View<{ marginTop: number; marginBottom: number; height: number }>(
  ({ marginTop, marginBottom, height }) => ({
    alignSelf: 'center',
    height,
    marginTop,
    marginBottom,
    width: '90%',
  })
)

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
