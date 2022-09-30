import { ComponentStory } from '@storybook/react'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'

import { ColorsEnum, UniqueColors } from './colors'
import { Typo } from './typography'

export default {
  title: 'Fondations/Colors',
}

type RectangleProps = {
  color: string
  children?: never
}

type ColorProps = RectangleProps & {
  name: string
}

const Color: FunctionComponent<ColorProps> = ({ name, color }) => (
  <ColorContainer>
    <Rectangle color={color} />
    <Typo.Caption>
      {name}: {color}
    </Typo.Caption>
  </ColorContainer>
)

const ColorContainer = styled.View({
  margin: getSpacing(5),
})

const Rectangle = styled.View<RectangleProps>(({ color }) => ({
  height: 125,
  width: 250,
  backgroundColor: color,
  boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
  marginBottom: getSpacing(2),
}))

const Colors: ComponentStory<
  FunctionComponent<{
    colorsPalette: Record<string, string>
    children?: never
  }>
> = ({ colorsPalette }) => (
  <Container>
    {Array.from(Object.entries(colorsPalette)).map(([name, color]) => (
      <Color key={name} name={name} color={color} />
    ))}
  </Container>
)

const Container = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
})

export const ColorsEnumPalette = Colors.bind({})
ColorsEnumPalette.storyName = 'ColorsEnumPalette'
ColorsEnumPalette.args = {
  colorsPalette: ColorsEnum,
}

export const UniqueColorsPalette = Colors.bind({})
UniqueColorsPalette.storyName = 'UniqueColorsPalette'
UniqueColorsPalette.args = {
  colorsPalette: UniqueColors,
}
