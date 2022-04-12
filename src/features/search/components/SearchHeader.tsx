import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { getSpacing, Spacer } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

import { SearchBox } from './SearchBox'

const inputHeight = getSpacing(12)

export const SearchHeader: React.FC = () => {
  const { top } = useCustomSafeInsets()
  const { isMobileViewport } = useTheme()
  const marginTop = isMobileViewport ? getSpacing(2) : getSpacing(4)
  const marginBottom = isMobileViewport ? getSpacing(6) : getSpacing(4)

  return (
    <React.Fragment>
      <HeaderBackgroundWrapper height={top + inputHeight + marginTop + marginBottom}>
        <HeaderBackground />
      </HeaderBackgroundWrapper>
      <Spacer.TopScreen />
      <SearchBoxContainer marginTop={marginTop} marginBottom={marginBottom}>
        <SearchBox />
      </SearchBoxContainer>
    </React.Fragment>
  )
}

const SearchBoxContainer = styled.View<{ marginTop: number; marginBottom: number }>(
  ({ marginTop, marginBottom }) => ({
    alignSelf: 'center',
    height: inputHeight,
    marginTop,
    marginBottom,
    width: '90%',
  })
)

const HeaderBackgroundWrapper = styled.View<{ height: number }>(({ height, theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  height,
  overflow: 'hidden',
  zIndex: theme.zIndex.background,
}))
