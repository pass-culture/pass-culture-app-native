import React from 'react'
import styled from 'styled-components/native'

import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { getSpacing, Spacer } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

import { SearchBox } from './SearchBox'

type Props = {
  searchInputID: string
}

export const SearchHeader: React.FC<Props> = ({ searchInputID }) => {
  const { top } = useCustomSafeInsets()
  const inputHeight = getSpacing(12)

  return (
    <React.Fragment>
      <HeaderBackgroundWrapper height={top + getSpacing(24)}>
        <HeaderBackground />
      </HeaderBackgroundWrapper>
      <Spacer.TopScreen />
      <SearchBoxContainer height={inputHeight} testID="searchBoxWithoutRework">
        <SearchBox searchInputID={searchInputID} />
      </SearchBoxContainer>
    </React.Fragment>
  )
}

const SearchBoxContainer = styled.View<{ height: number }>(({ height }) => ({
  alignSelf: 'center',
  height,
  marginVertical: getSpacing(6),
  width: '90%',
}))

const HeaderBackgroundWrapper = styled.View<{ height: number }>(({ height, theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  height,
  overflow: 'hidden',
  zIndex: theme.zIndex.background,
}))
