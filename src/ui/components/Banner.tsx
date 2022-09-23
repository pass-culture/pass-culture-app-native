import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { Error } from 'ui/svg/icons/Error'
import { Spacer, getSpacing, Typo } from 'ui/theme'

export const Banner: React.FC<{ title: string }> = ({ title }) => (
  <Background>
    <IconWrapper>
      <StyledError />
    </IconWrapper>
    <Spacer.Row numberOfSpaces={3} />
    <TextContainer>
      <Typo.Caption>{title}</Typo.Caption>
    </TextContainer>
  </Background>
)

const Background = styled(View)(({ theme }) => ({
  display: 'flex',
  backgroundColor: theme.colors.greyLight,
  paddingVertical: getSpacing(4),
  paddingLeft: getSpacing(3),
  paddingRight: getSpacing(5),
  alignItems: 'center',
  flexDirection: 'row',
  borderRadius: getSpacing(1),
}))

const IconWrapper = styled.View({
  flexShrink: 0,
})

const StyledError = styled(Error).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``

const TextContainer = styled(View)({
  flexShrink: 1,
})
