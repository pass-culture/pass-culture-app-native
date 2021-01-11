import React from 'react'
import styled from 'styled-components/native'

import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { getSpacing, Spacer } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

import { SearchBox } from './SearchBox'

const inputHeight = getSpacing(12)
const marginTop = getSpacing(2)
const marginBottom = getSpacing(6)

export const SearchHeader: React.FC = () => {
  const { top } = useCustomSafeInsets()

  return (
    <React.Fragment>
      <HeaderBackgroundWrapper height={top + inputHeight + marginTop + marginBottom}>
        <HeaderBackground />
      </HeaderBackgroundWrapper>
      <Spacer.TopScreen />
      <Container>
        <SearchBox />
      </Container>
    </React.Fragment>
  )
}

const Container = styled.View({
  height: inputHeight,
  marginTop,
  marginBottom,
})

const HeaderBackgroundWrapper = styled.View<{ height: number }>(({ height }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 0,
  height,
  overflow: 'hidden',
}))
