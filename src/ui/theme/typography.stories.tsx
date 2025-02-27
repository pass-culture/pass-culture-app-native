import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { TypoDS } from 'ui/theme/designSystemTypographie'

import { Typo } from './typography'

const meta: Meta = {
  title: 'Fondations/Typographies',
}
export default meta

type TypographyComponents = (typeof Typo)[keyof typeof Typo]
type Story = StoryObj<TypographyComponents>

export const Typographies: Story = {
  name: 'Typographies',
  render: () => (
    <ViewGap gap={5}>
      <Typo.Title1>Title1</Typo.Title1>
      <TypoDS.Title2>Title2</TypoDS.Title2>
      <Typo.Title3>Title3</Typo.Title3>
      <Typo.Title4>Title4</Typo.Title4>
      <Typo.Body>Body</Typo.Body>
      <Typo.ButtonText>ButtonText</Typo.ButtonText>
      <Typo.ButtonTextNeutralInfo>ButtonTextNeutralInfo</Typo.ButtonTextNeutralInfo>
      <Typo.ButtonTextPrimary>ButtonTextPrimary</Typo.ButtonTextPrimary>
      <Typo.ButtonTextSecondary>ButtonTextSecondary</Typo.ButtonTextSecondary>
      <Typo.Caption>Caption</Typo.Caption>
      <Typo.CaptionPrimary>CaptionPrimary</Typo.CaptionPrimary>
      <Typo.CaptionSecondary>CaptionSecondary</Typo.CaptionSecondary>
      <Typo.CaptionNeutralInfo>CaptionNeutralInfo</Typo.CaptionNeutralInfo>
      <Typo.Hint>Hint</Typo.Hint>
    </ViewGap>
  ),
}
