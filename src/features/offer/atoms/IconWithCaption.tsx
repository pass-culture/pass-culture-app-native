import React from 'react'
import styled from 'styled-components/native'

import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

interface IconWithCaptionProps {
  Icon: React.ElementType<{ size: number; color: ColorsEnum }>
  caption: string
}

export const IconWithCaption = ({ Icon, caption }: IconWithCaptionProps) => (
  <Container>
    <IconContainer>
      <Icon size={getSpacing(10)} color={ColorsEnum.GREY_DARK} />
    </IconContainer>
    <Caption>{caption}</Caption>
  </Container>
)

const Container = styled.View({ flex: 1, alignItems: 'center' })
const IconContainer = styled.View({ padding: getSpacing(1) })
const Caption = styled(Typo.Caption)({ textAlign: 'center' })
