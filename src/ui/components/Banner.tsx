import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { Error } from 'ui/svg/icons/Error'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Spacer, getSpacing, Typo } from 'ui/theme'

export const Banner: React.FC<{ title: string; icon?: React.FC<AccessibleIcon> }> = ({
  title,
  icon: Icon,
}) => (
  <Background>
    <IconWrapper>
      <StyledIcon as={Icon} />
    </IconWrapper>
    <Spacer.Row numberOfSpaces={4} />
    <TextContainer>
      <Typo.Caption>{title}</Typo.Caption>
    </TextContainer>
  </Background>
)

const Background = styled(View)(({ theme }) => ({
  display: 'flex',
  backgroundColor: theme.colors.greyLight,
  padding: getSpacing(4),
  alignItems: 'center',
  flexDirection: 'row',
  borderRadius: getSpacing(2),
}))

const IconWrapper = styled.View({
  flexShrink: 0,
})

const StyledIcon = styled(Error).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
  color: theme.colors.greyDark,
  color2: theme.colors.greyDark,
}))``

const TextContainer = styled(View)({
  flexShrink: 1,
})
