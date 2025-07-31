import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { ViewGap } from 'ui/components/ViewGap/ViewGap'

import { Typo } from './typography'

const meta: Meta<typeof Typo> = {
  title: 'Design System/Typographies',
}

type Story = StoryObj<typeof Typo>

const Template: Story = {
  render: () => (
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
  ),
}

export default meta
export const Typographies = Template
