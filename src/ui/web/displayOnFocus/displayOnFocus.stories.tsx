import { ComponentStory } from '@storybook/react'
import { userEvent, screen } from '@storybook/testing-library'
import React, { Fragment, FunctionComponent } from 'react'
import styled from 'styled-components'

import { Typo } from 'ui/theme'

import { displayOnFocus } from './displayOnFocus'

export default {
  title: 'ui/a11y/displayOnFocus',
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

const SomeComponentThatDisplayOnFocus = displayOnFocus(SomeNormalComponent)

const Template: ComponentStory<FunctionComponent> = () => (
  <Fragment>
    <Typo.Body>
      {body1}
      <Typo.Caption>{caption}</Typo.Caption>
      {body2}
    </Typo.Body>
    <RelativeWrapper>
      <SomeComponentThatDisplayOnFocus>{buttonText}</SomeComponentThatDisplayOnFocus>
    </RelativeWrapper>
  </Fragment>
)

export const Default = Template.bind({})
Default.play = async () => {
  await screen.findByRole('button') // wait first render

  userEvent.tab()
}
