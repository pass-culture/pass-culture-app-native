import React from 'react'
import styled from 'styled-components/native'

import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { getSpacing, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

interface SvgPageHeaderProps {
  title: string
}

export function SvgPageHeader({ title }: SvgPageHeaderProps) {
  const { top } = useCustomSafeInsets()
  const maxHeight = getSpacing(14) + top
  return (
    <HeaderBackgroundWrapper maxHeight={maxHeight}>
      <HeaderBackground height={'100%'} position="relative" />
      <Title>{title}</Title>
    </HeaderBackgroundWrapper>
  )
}

const HeaderBackgroundWrapper = styled.View<{ maxHeight?: number }>(({ maxHeight }) => ({
  alignItems: 'center',
  maxHeight,
}))

const Title = styled(Typo.Title4).attrs(() => getHeadingAttrs(1))(({ theme }) => ({
  position: 'absolute',
  bottom: getSpacing(3),
  color: theme.colors.white,
}))
