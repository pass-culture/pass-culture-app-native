import { ComponentStory } from '@storybook/react'
import React from 'react'

import { Typo } from './typography'

export default {
  title: 'ui/Typo',
}

export const Hero: ComponentStory<typeof Typo.Hero> = ({ children }) => (
  <Typo.Hero>{children}</Typo.Hero>
)
Hero.args = {
  children: 'Hero',
}

export const Title1: ComponentStory<typeof Typo.Title1> = ({ children }) => (
  <Typo.Title1>{children}</Typo.Title1>
)
Title1.args = {
  children: 'Title1',
}

export const Title2: ComponentStory<typeof Typo.Title2> = ({ children }) => (
  <Typo.Title2>{children}</Typo.Title2>
)
Title2.args = {
  children: 'Title2',
}

export const Title3: ComponentStory<typeof Typo.Title3> = ({ children }) => (
  <Typo.Title3>{children}</Typo.Title3>
)
Title3.args = {
  children: 'Title3',
}

export const Title4: ComponentStory<typeof Typo.Title4> = ({ children }) => (
  <Typo.Title4>{children}</Typo.Title4>
)
Title4.args = {
  children: 'Title4',
}

export const Body: ComponentStory<typeof Typo.Body> = ({ children }) => (
  <Typo.Body>{children}</Typo.Body>
)
Body.args = {
  children: 'Body',
}

export const ButtonText: ComponentStory<typeof Typo.ButtonText> = ({ children }) => (
  <Typo.ButtonText>{children}</Typo.ButtonText>
)
ButtonText.args = {
  children: 'ButtonText',
}

export const Caption: ComponentStory<typeof Typo.Caption> = ({ children }) => (
  <Typo.Caption>{children}</Typo.Caption>
)
Caption.args = {
  children: 'Caption',
}
