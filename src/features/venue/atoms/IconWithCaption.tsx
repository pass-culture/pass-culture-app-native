import React from 'react'
import webStyled from 'styled-components'
import styled, { useTheme } from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Spacer } from 'ui/theme'
import { Dd } from 'ui/web/list/Dd'
import { Dt } from 'ui/web/list/Dt'

interface IconWithCaptionProps {
  Icon: React.FC<IconInterface>
  caption: string
  testID?: string
  isDisabled?: boolean | false
}

export const IconWithCaption = ({ Icon, caption, testID, isDisabled }: IconWithCaptionProps) => {
  const { colors } = useTheme()

  return (
    <Container>
      <IconContainer>
        <Icon size={getSpacing(10)} color={colors.greyDark} testID={testID} />
      </IconContainer>
      <Spacer.Column numberOfSpaces={1} />
      <Caption testID={`caption-${testID}`} disabled={isDisabled}>
        {caption}
      </Caption>
    </Container>
  )
}

const Container = styled.View({ flex: 1, alignItems: 'center' })

const IconContainer = webStyled(Dt)({ padding: getSpacing(1) })

const Caption = webStyled(Dd)<{ disabled?: boolean }>(({ disabled, theme }) => ({
  ...theme.typography.caption,
  color: disabled ? theme.colors.greyDark : theme.colors.black,
  textAlign: 'center',
}))
