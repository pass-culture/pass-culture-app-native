import { t } from '@lingui/macro'
import React from 'react'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import styled from 'styled-components/native'

import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { ColorsEnum, getSpacing, Typo, ScreenWidth } from 'ui/theme'

interface SvgPageHeaderProps {
  title: string
}

export default function SvgPageHeader(props: SvgPageHeaderProps) {
  return (
    <HeaderBackgroundWrapper>
      <HeaderBackground width={ScreenWidth} />
      <Title>{t`${props.title}`}</Title>
    </HeaderBackgroundWrapper>
  )
}

const HeaderBackgroundWrapper = styled.View({
  maxHeight: getSpacing(14) + getStatusBarHeight(true),
  overflow: 'hidden',
  position: 'relative',
  alignItems: 'center',
})

const Title = styled(Typo.Title4)({
  position: 'absolute',
  bottom: getSpacing(3),
  color: ColorsEnum.WHITE,
})
