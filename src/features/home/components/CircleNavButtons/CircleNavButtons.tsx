import React, { FC } from 'react'
import { useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { getSpacing, Typo } from 'ui/theme'

import FreeImage from '../../images/free.png'
import MapImage from '../../images/map.png'
import RecosImage from '../../images/recos.png'
import WeekendImage from '../../images/weekend.png'

const BUTTONS = [
  { title: 'À coté', image: MapImage },
  { title: 'Les recos', image: RecosImage },
  { title: 'Ce week-end', image: WeekendImage },
  { title: 'Gratuit', image: FreeImage },
]

export const CircleNavButtons: FC = () => {
  const { width } = useWindowDimensions()
  const isSmallScreen = width < 375

  return (
    <Container isSmallScreen={isSmallScreen}>
      {BUTTONS.map(({ image, title }) => (
        <Item key={title}>
          <ItemIcon source={image} />
          <StyledText>{title}</StyledText>
        </Item>
      ))}
    </Container>
  )
}

const Container = styled.View<{ isSmallScreen: boolean }>(({ isSmallScreen }) => ({
  flexDirection: 'row',
  gap: isSmallScreen ? getSpacing(1) : getSpacing(2),
  justifyContent: 'center',
}))

const Item = styledButton(Touchable)({
  width: getSpacing(19),
  gap: getSpacing(2),
  padding: getSpacing(0.75),
  alignItems: 'center',
})

const StyledText = styled(Typo.Caption).attrs({
  numberOfLines: 2,
})({
  textAlign: 'center',
})

const ItemIcon = styled.Image({
  width: getSpacing(14),
  height: getSpacing(14),
})
