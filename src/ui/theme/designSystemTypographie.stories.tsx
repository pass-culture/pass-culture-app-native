import { ComponentStory } from '@storybook/react'
import React from 'react'

import { Spacer } from 'ui/components/spacer/Spacer'

import { TypoDS } from './designSystemTypographie'

export default {
  title: 'Fondations/TypoDS',
}

export const Typographies: ComponentStory<typeof TypoDS.Title1> = () => (
  <React.Fragment>
    <Spacer.Column numberOfSpaces={2} />
    <TypoDS.Title1>Title1</TypoDS.Title1>
    <Spacer.Column numberOfSpaces={2} />
    <TypoDS.Title2>Title2</TypoDS.Title2>
    <Spacer.Column numberOfSpaces={2} />
    <TypoDS.Title3>Title3</TypoDS.Title3>
    <Spacer.Column numberOfSpaces={2} />
    <TypoDS.Title4>Title4</TypoDS.Title4>
    <Spacer.Column numberOfSpaces={2} />
    <TypoDS.Body>Body</TypoDS.Body>
    <Spacer.Column numberOfSpaces={2} />
    <TypoDS.BodyS>BodyS</TypoDS.BodyS>
    <Spacer.Column numberOfSpaces={2} />
    <TypoDS.BodyXs>BodyXs</TypoDS.BodyXs>
    <Spacer.Column numberOfSpaces={2} />
    <TypoDS.BodySemiBold>BodySemiBold</TypoDS.BodySemiBold>
    <Spacer.Column numberOfSpaces={2} />
    <TypoDS.BodySemiBoldS>BodySemiBoldS</TypoDS.BodySemiBoldS>
    <Spacer.Column numberOfSpaces={2} />
    <TypoDS.BodySemiBoldXs>BodySemiBoldXs</TypoDS.BodySemiBoldXs>
    <Spacer.Column numberOfSpaces={2} />
    <TypoDS.BodyItalic>BodyItalic</TypoDS.BodyItalic>
    <Spacer.Column numberOfSpaces={2} />
    <TypoDS.BodySemiBoldItalic>BodySemiBoldItalic</TypoDS.BodySemiBoldItalic>
    <Spacer.Column numberOfSpaces={2} />
    <TypoDS.Button>Button</TypoDS.Button>
    <Spacer.Column numberOfSpaces={2} />
    <TypoDS.Link>Link</TypoDS.Link>
    <Spacer.Column numberOfSpaces={2} />
    <TypoDS.Caption>Caption</TypoDS.Caption>
    <Spacer.Column numberOfSpaces={2} />
    <TypoDS.Hint>Hint</TypoDS.Hint>
    <Spacer.Column numberOfSpaces={2} />
    <TypoDS.Placeholder>Placeholder</TypoDS.Placeholder>
  </React.Fragment>
)
