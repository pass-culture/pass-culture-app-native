import React from 'react'
import webStyled from 'styled-components'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Spacer } from 'ui/theme'
import { Dd } from 'ui/web/list/Dd'
import { Dt } from 'ui/web/list/Dt'
interface IconWithCaptionProps {
  Icon: React.FC<IconInterface>
  caption: string
  testID?: string
}

export const IconWithCaption = ({ Icon, caption, testID }: IconWithCaptionProps) => {
  const StyledIcon = styled(Icon).attrs(({ theme }) => ({
    color: theme.colors.greyDark,
    size: theme.icons.sizes.standard,
  }))``

  return (
    <Container>
      <IconContainer>
        <StyledIcon testID={testID} />
      </IconContainer>
      <Spacer.Column numberOfSpaces={2} />
      <Caption testID={`caption-${testID}`}>{caption}</Caption>
    </Container>
  )
}

const Container = styled.View({ flex: 1, alignItems: 'center' })
const IconContainer = webStyled(Dt)({ padding: getSpacing(1) })
const Caption = webStyled(Dd)(({ theme }) => ({
  ...theme.typography.caption,
  textAlign: 'center',
}))
