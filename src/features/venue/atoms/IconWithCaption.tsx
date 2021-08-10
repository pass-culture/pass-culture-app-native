import React from 'react'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

interface IconWithCaptionProps {
  Icon: React.FC<IconInterface>
  caption: string
  testID?: string
}

export const IconWithCaption = ({ Icon, caption, testID }: IconWithCaptionProps) => (
  <Container>
    <IconContainer>
      <Icon size={getSpacing(10)} color={ColorsEnum.GREY_DARK} testID={testID} />
    </IconContainer>
    <Caption testID={`caption-${testID}`}>{caption}</Caption>
  </Container>
)

const Container = styled.View({ flex: 1, alignItems: 'center' })
const IconContainer = styled.View({ padding: getSpacing(1) })
const Caption = styled(Typo.Caption)({ textAlign: 'center' })
