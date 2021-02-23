import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { Info } from 'ui/svg/icons/Info'
import { ColorsEnum, Spacer, getSpacing, Typo } from 'ui/theme'

export enum BannerType {
  INFO = 'info',
}

type Props = {
  title: string
  type?: BannerType
}

const renderIcon = (type: BannerType) => {
  switch (type) {
    case BannerType.INFO:
      return <Info size={32} color={ColorsEnum.BLACK} />
    default:
      return <Info size={32} color={ColorsEnum.BLACK} />
  }
}

export const Banner: React.FC<Props> = ({ title, type = BannerType.INFO }) => (
  <Background>
    <Spacer.Row numberOfSpaces={3} />
    {renderIcon(type)}
    <Spacer.Row numberOfSpaces={3} />
    <TextContainer>
      <Typo.Caption color={ColorsEnum.BLACK}>{title}</Typo.Caption>
    </TextContainer>
    <Spacer.Row numberOfSpaces={5} />
  </Background>
)

const Background = styled(View)({
  display: 'flex',
  backgroundColor: ColorsEnum.GREY_LIGHT,
  paddingVertical: getSpacing(4),
  alignItems: 'center',
  flexDirection: 'row',
  borderRadius: getSpacing(1),
})

const TextContainer = styled(View)({
  flexShrink: 1,
})
