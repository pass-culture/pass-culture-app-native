import { ComponentStory } from '@storybook/react'
import React from 'react'

import { ViewGap } from 'ui/components/ViewGap/ViewGap'

import { TypoDS } from './designSystemTypographie'

export default {
  title: 'Design System/TypoDS',
}

type TypographyComponents = (typeof TypoDS)[keyof typeof TypoDS]

export const Typographies: ComponentStory<TypographyComponents> = () => (
  <ViewGap gap={2}>
    <TypoDS.Title1>Title1</TypoDS.Title1>
    <TypoDS.Title2>Title2</TypoDS.Title2>
    <TypoDS.Title3>Title3</TypoDS.Title3>
    <TypoDS.Title4>Title4</TypoDS.Title4>
    <TypoDS.Body>Body</TypoDS.Body>
    <TypoDS.BodyS>BodyS</TypoDS.BodyS>
    <TypoDS.BodyXs>BodyXs</TypoDS.BodyXs>
    <TypoDS.BodySemiBold>BodySemiBold</TypoDS.BodySemiBold>
    <TypoDS.BodySemiBoldS>BodySemiBoldS</TypoDS.BodySemiBoldS>
    <TypoDS.BodySemiBoldXs>BodySemiBoldXs</TypoDS.BodySemiBoldXs>
    <TypoDS.BodyItalic>BodyItalic</TypoDS.BodyItalic>
    <TypoDS.BodyItalicSemiBold>BodySemiBoldItalic</TypoDS.BodyItalicSemiBold>
    <TypoDS.Button>Button</TypoDS.Button>
  </ViewGap>
)
