import { ComponentStory } from '@storybook/react'
import React from 'react'

import { Spacer } from 'ui/components/spacer/Spacer'
import { TypoDS } from 'ui/theme/designSystemTypographie'

import { Typo } from './typography'

export default {
  title: 'Fondations/Typo',
}

type TypographyComponents = (typeof Typo)[keyof typeof Typo]

export const Typographies: ComponentStory<TypographyComponents> = () => (
  <React.Fragment>
    <Spacer.Column numberOfSpaces={2} />
    <Typo.Title1>Title1</Typo.Title1>
    <Spacer.Column numberOfSpaces={2} />
    <TypoDS.Title2>Title2</TypoDS.Title2>
    <Spacer.Column numberOfSpaces={2} />
    <Typo.Title3>Title3</Typo.Title3>
    <Spacer.Column numberOfSpaces={2} />
    <Typo.Title4>Title4</Typo.Title4>
    <Spacer.Column numberOfSpaces={2} />
    <Typo.Body>Body</Typo.Body>
    <Spacer.Column numberOfSpaces={2} />
    <Typo.ButtonText>ButtonText</Typo.ButtonText>
    <Spacer.Column numberOfSpaces={2} />
    <Typo.ButtonTextNeutralInfo>ButtonTextNeutralInfo</Typo.ButtonTextNeutralInfo>
    <Spacer.Column numberOfSpaces={2} />
    <Typo.ButtonTextPrimary>ButtonTextPrimary</Typo.ButtonTextPrimary>
    <Spacer.Column numberOfSpaces={2} />
    <Typo.ButtonTextSecondary>ButtonTextSecondary</Typo.ButtonTextSecondary>
    <Spacer.Column numberOfSpaces={2} />
    <Typo.Caption>Caption</Typo.Caption>
    <Spacer.Column numberOfSpaces={2} />
    <Typo.CaptionPrimary>CaptionPrimary</Typo.CaptionPrimary>
    <Spacer.Column numberOfSpaces={2} />
    <Typo.CaptionSecondary>CaptionSecondary</Typo.CaptionSecondary>
    <Spacer.Column numberOfSpaces={2} />
    <Typo.CaptionNeutralInfo>CaptionNeutralInfo</Typo.CaptionNeutralInfo>
    <Spacer.Column numberOfSpaces={2} />
    <Typo.Hint>Hint</Typo.Hint>
  </React.Fragment>
)
