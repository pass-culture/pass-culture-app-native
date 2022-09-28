import { ComponentStory } from '@storybook/react'
import React from 'react'

import { Typo } from './typography'

export default {
  title: 'Fondations/Typo',
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
Title1.storyName = 'Title1'
Title1.args = {
  children: 'Title1',
}

export const Title2: ComponentStory<typeof Typo.Title2> = ({ children }) => (
  <Typo.Title2>{children}</Typo.Title2>
)
Title2.storyName = 'Title2'
Title2.args = {
  children: 'Title2',
}

export const Title3: ComponentStory<typeof Typo.Title3> = ({ children }) => (
  <Typo.Title3>{children}</Typo.Title3>
)
Title3.storyName = 'Title3'
Title3.args = {
  children: 'Title3',
}

export const Title4: ComponentStory<typeof Typo.Title4> = ({ children }) => (
  <Typo.Title4>{children}</Typo.Title4>
)
Title4.storyName = 'Title4'
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
ButtonText.storyName = 'ButtonText'
ButtonText.args = {
  children: 'ButtonText',
}

export const ButtonTextNeutralInfo: ComponentStory<typeof Typo.ButtonTextNeutralInfo> = ({
  children,
}) => <Typo.ButtonTextNeutralInfo>{children}</Typo.ButtonTextNeutralInfo>
ButtonTextNeutralInfo.storyName = 'ButtonTextNeutralInfo'
ButtonTextNeutralInfo.args = {
  children: 'ButtonTextNeutralInfo',
}

export const ButtonTextPrimary: ComponentStory<typeof Typo.ButtonTextPrimary> = ({ children }) => (
  <Typo.ButtonTextPrimary>{children}</Typo.ButtonTextPrimary>
)
ButtonTextPrimary.storyName = 'ButtonTextPrimary'
ButtonTextPrimary.args = {
  children: 'ButtonTextPrimary',
}

export const ButtonTextSecondary: ComponentStory<typeof Typo.ButtonTextSecondary> = ({
  children,
}) => <Typo.ButtonTextSecondary>{children}</Typo.ButtonTextSecondary>
ButtonTextSecondary.storyName = 'ButtonTextSecondary'
ButtonTextSecondary.args = {
  children: 'ButtonTextSecondary',
}

export const Caption: ComponentStory<typeof Typo.Caption> = ({ children }) => (
  <Typo.Caption>{children}</Typo.Caption>
)
Caption.args = {
  children: 'Caption',
}

export const CaptionPrimary: ComponentStory<typeof Typo.CaptionPrimary> = ({ children }) => (
  <Typo.CaptionPrimary>{children}</Typo.CaptionPrimary>
)
CaptionPrimary.args = {
  children: 'CaptionPrimary',
}

export const CaptionSecondary: ComponentStory<typeof Typo.CaptionSecondary> = ({ children }) => (
  <Typo.CaptionSecondary>{children}</Typo.CaptionSecondary>
)
CaptionSecondary.args = {
  children: 'CaptionSecondary',
}

export const CaptionNeutralInfo: ComponentStory<typeof Typo.CaptionNeutralInfo> = ({
  children,
}) => <Typo.CaptionNeutralInfo>{children}</Typo.CaptionNeutralInfo>
CaptionNeutralInfo.args = {
  children: 'CaptionNeutralInfo',
}
