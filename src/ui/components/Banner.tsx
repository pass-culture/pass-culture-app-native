import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { WarningDeprecated } from 'ui/svg/icons/Warning_deprecated'
import { ColorsEnum, Spacer, getSpacing, Typo } from 'ui/theme'

export const Banner: React.FC<{ title: string }> = ({ title }) => (
  <Background>
    <WarningDeprecated size={32} color={ColorsEnum.BLACK} />
    <Spacer.Row numberOfSpaces={3} />
    <TextContainer>
      <Typo.Caption color={ColorsEnum.BLACK}>{title}</Typo.Caption>
    </TextContainer>
  </Background>
)

const Background = styled(View)({
  display: 'flex',
  backgroundColor: ColorsEnum.GREY_LIGHT,
  paddingVertical: getSpacing(4),
  paddingLeft: getSpacing(3),
  paddingRight: getSpacing(5),
  alignItems: 'center',
  flexDirection: 'row',
  borderRadius: getSpacing(1),
})

const TextContainer = styled(View)({
  flexShrink: 1,
})
