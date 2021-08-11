import React from 'react'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

interface IconWithCaptionProps {
  Icon: React.FC<IconInterface>
  caption: string
  testID?: string
  isDisabled?: boolean | false
}

export const IconWithCaption = ({ Icon, caption, testID, isDisabled }: IconWithCaptionProps) => {
  const getTextColor = (isDisabled: boolean) => {
    if (isDisabled) return ColorsEnum.GREY_MEDIUM
    return ColorsEnum.GREY_DARK
  }

  const color = getTextColor(isDisabled as boolean)

  return (
    <Container>
      <IconContainer>
        <Icon size={getSpacing(10)} color={color} testID={testID} />
      </IconContainer>
      <Caption testID={`caption-${testID}`} color={color}>
        {caption}
      </Caption>
    </Container>
  )
}

const Container = styled.View({ flex: 1, alignItems: 'center' })
const IconContainer = styled.View({ padding: getSpacing(1) })
const Caption = styled(Typo.Caption)({ textAlign: 'center' })
