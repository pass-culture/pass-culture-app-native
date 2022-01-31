import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { Error } from 'ui/svg/icons/Error'
import { Spacer, getSpacing, Typo } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

export const Banner: React.FC<{ title: string }> = ({ title }) => (
  <Background>
    <Error size={24} color={ColorsEnum.BLACK} />
    <Spacer.Row numberOfSpaces={3} />
    <TextContainer>
      <Caption>{title}</Caption>
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

const TextContainer = styled(View)({
  flexShrink: 1,
})

const Caption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.black,
}))
