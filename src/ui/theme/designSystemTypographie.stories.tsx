import { ComponentStory } from '@storybook/react'
import React from 'react'

import { ViewGap } from 'ui/components/ViewGap/ViewGap'

import { TypoDS } from './designSystemTypographie'

export default {
  title: 'Design System/Typographies',
}

type TypographyComponents = (typeof TypoDS)[keyof typeof TypoDS]

const Template: ComponentStory<TypographyComponents> = () => (
  <ViewGap gap={5}>
    <TypoDS.Title1>Title1</TypoDS.Title1>
    <TypoDS.Title2>Title2</TypoDS.Title2>
    <TypoDS.Title3>Title3</TypoDS.Title3>
    <TypoDS.Title4>Title4</TypoDS.Title4>
    <TypoDS.Body>Body</TypoDS.Body>
    <TypoDS.BodyS>BodyS</TypoDS.BodyS>
    <TypoDS.BodyXs>BodyXs</TypoDS.BodyXs>
    <TypoDS.BodyAccent>BodyAccent</TypoDS.BodyAccent>
    <TypoDS.BodyAccentS>BodyAccentS</TypoDS.BodyAccentS>
    <TypoDS.BodyAccentXs>BodyAccentXs</TypoDS.BodyAccentXs>
    <TypoDS.BodyItalic>BodyItalic</TypoDS.BodyItalic>
    <TypoDS.BodyItalicAccent>BodyAccentItalic</TypoDS.BodyItalicAccent>
    <TypoDS.Button>Button</TypoDS.Button>
  </ViewGap>
)

export const Typographies = Template.bind({})
Typographies.storyName = 'Typographies'
