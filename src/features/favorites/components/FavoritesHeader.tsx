import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

const inputHeight = getSpacing(8)
const marginTop = getSpacing(2)
const marginBottom = getSpacing(2)

export const FavoritesHeader: React.FC = () => {
  const { top } = useCustomSafeInsets()

  return (
    <React.Fragment>
      <HeaderBackgroundWrapper height={top + inputHeight + marginTop + marginBottom}>
        <HeaderBackground />
      </HeaderBackgroundWrapper>
      <Spacer.TopScreen />
      <Container>
        <Typo.Title4 color={ColorsEnum.WHITE}>{_(t`Mes favoris`)}</Typo.Title4>
      </Container>
    </React.Fragment>
  )
}

const Container = styled.View({
  alignSelf: 'center',
  justifyContent: 'flex-end',
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
