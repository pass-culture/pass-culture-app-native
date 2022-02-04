import React from 'react'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Spacer, Typo } from 'ui/theme'
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
const IconContainer = styled.View({ padding: getSpacing(1) })
const Caption = styled(Typo.Caption)({ textAlign: 'center' })
