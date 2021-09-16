import React from 'react'
import { useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

interface SvgPageHeaderProps {
  title: string
}

export default function SvgPageHeader({ title }: SvgPageHeaderProps) {
  const windowWidth = useWindowDimensions().width
  const { top } = useCustomSafeInsets()
  return (
    <HeaderBackgroundWrapper style={{ maxHeight: getSpacing(14) + top }}>
      <HeaderBackground width={windowWidth} />
      <Title>{title}</Title>
    </HeaderBackgroundWrapper>
  )
}

const HeaderBackgroundWrapper = styled.View({
  overflow: 'hidden',
  position: 'relative',
  alignItems: 'center',
})

const Title = styled(Typo.Title4)({
  position: 'absolute',
  bottom: getSpacing(3),
  color: ColorsEnum.WHITE,
})
