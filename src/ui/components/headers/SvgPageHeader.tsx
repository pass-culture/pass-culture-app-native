import React from 'react'
import styled from 'styled-components/native'

import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { getSpacing, Typo } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

interface SvgPageHeaderProps {
  title: string
}

export default function SvgPageHeader({ title }: SvgPageHeaderProps) {
  const { top } = useCustomSafeInsets()
  return (
    <HeaderBackgroundWrapper style={{ maxHeight: getSpacing(14) + top }}>
      <HeaderBackground />
      <Title>{title}</Title>
    </HeaderBackgroundWrapper>
  )
}

const HeaderBackgroundWrapper = styled.View({
  overflow: 'hidden',
  position: 'relative',
  alignItems: 'center',
})

const Title = styled(Typo.Title4)(({ theme }) => ({
  position: 'absolute',
  bottom: getSpacing(3),
  color: theme.colors.white,
}))
