import { ComponentStory } from '@storybook/react'
import { userEvent, screen } from '@storybook/testing-library'
import React, { Fragment, FunctionComponent, PropsWithChildren } from 'react'
import styled from 'styled-components'

import { TypoDS } from 'ui/theme'

import { displayOnFocus } from './displayOnFocus'

export default {
  title: 'ui/accessibility/displayOnFocus',
}

const body1 = 'a component wrapped with '
const caption = 'displayOnFocus'
const body2 = ' is a component that should be visible only when giving focus'
const buttonText = 'Some content'

const RelativeWrapper = styled.div({
  position: 'relative',
})

const SomeNormalComponent = styled.button({
  disblay: 'flex',
  '&:focus': {
    width: '90vw !important', // exemple to override style of displayOnFocus:focus
    outline: 'royalblue solid 1px',
  },
})

const SomeComponentThatDisplayOnFocus: React.FC<PropsWithChildren> =
  displayOnFocus(SomeNormalComponent)

const Template: ComponentStory<FunctionComponent> = () => (
  <Fragment>
    <TypoDS.Body>
      {body1}
      <TypoDS.BodyAccentXs>{caption}</TypoDS.BodyAccentXs>
      {body2}
    </TypoDS.Body>
    <RelativeWrapper>
      <SomeComponentThatDisplayOnFocus>{buttonText}</SomeComponentThatDisplayOnFocus>
    </RelativeWrapper>
  </Fragment>
)

export const Default = Template.bind({})
Default.storyName = 'displayOnFocus'
Default.play = async () => {
  await screen.findByRole('button') // wait first render

  userEvent.tab()
}
