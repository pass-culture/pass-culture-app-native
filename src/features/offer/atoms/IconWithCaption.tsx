import React from 'react'
import styled from 'styled-components/native'

import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

interface IconWithCaptionProps {
  Icon: React.ElementType<{ size: number; color: ColorsEnum }>
  caption: string
}

export const IconWithCaption = ({ Icon, caption }: IconWithCaptionProps) => (
  <Container>
    <Icon size={getSpacing(12)} color={ColorsEnum.GREY_DARK} />
    <Typo.Caption>{caption}</Typo.Caption>
  </Container>
)

const Container = styled.View({ flex: 1, alignItems: 'center' })
