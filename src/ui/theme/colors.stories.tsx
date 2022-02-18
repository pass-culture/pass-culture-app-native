import { ComponentStory } from '@storybook/react'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ColorsEnum, UniqueColors } from './colors'
import { Typo } from './typography'

export default {
  title: 'ui/Colors',
}

type RectangleProps = {
  color: string
  children?: never
}

type ColorProps = RectangleProps & {
  name: string
}

const Color: FunctionComponent<ColorProps> = ({ name, color }) => (
  <figure>
    <Rectangle color={color} />
    <figcaption>
      <Typo.Caption>
        {/* eslint-disable-next-line react-native/no-raw-text */}
        {name}: {color}
      </Typo.Caption>
    </figcaption>
  </figure>
)

const Rectangle = styled.View<RectangleProps>(({ color }) => ({
  height: 125,
  width: 250,
  backgroundColor: color,
  boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
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
ColorsEnumPalette.args = {
  colorsPalette: ColorsEnum,
}

export const UniqueColorsPalette = Colors.bind({})
UniqueColorsPalette.args = {
  colorsPalette: UniqueColors,
}
