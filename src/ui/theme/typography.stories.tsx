import { ComponentStory } from '@storybook/react'
import React from 'react'

import { ViewGap } from 'ui/components/ViewGap/ViewGap'

import { Typo } from './typography'

export default {
  title: 'Design System/Typographies',
}

type TypographyComponents = (typeof Typo)[keyof typeof Typo]

const Template: ComponentStory<TypographyComponents> = () => (
  <ViewGap gap={5}>
    <Typo.Title1>Title1</Typo.Title1>
    <Typo.Title2>Title2</Typo.Title2>
    <Typo.Title3>Title3</Typo.Title3>
    <Typo.Title4>Title4</Typo.Title4>
    <Typo.Body>Body</Typo.Body>
    <Typo.BodyS>BodyS</Typo.BodyS>
    <Typo.BodyXs>BodyXs</Typo.BodyXs>
    <Typo.BodyAccent>BodyAccent</Typo.BodyAccent>
    <Typo.BodyAccentS>BodyAccentS</Typo.BodyAccentS>
    <Typo.BodyAccentXs>BodyAccentXs</Typo.BodyAccentXs>
    <Typo.BodyItalic>BodyItalic</Typo.BodyItalic>
    <Typo.BodyItalicAccent>BodyAccentItalic</Typo.BodyItalicAccent>
    <Typo.Button>Button</Typo.Button>
  </ViewGap>
)

export const Typographies = Template.bind({})
Typographies.storyName = 'Typographies'
