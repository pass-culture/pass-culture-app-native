import { Meta, StoryObj } from '@storybook/react'
import { userEvent, screen } from '@storybook/test'
import React, { Fragment, FunctionComponent, PropsWithChildren } from 'react'
import styled from 'styled-components'

import { TypoDS } from 'ui/theme'

import { displayOnFocus } from './displayOnFocus'

const meta: Meta = {
  title: 'ui/accessibility/displayOnFocus',
}
export default meta

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

type Story = StoryObj<FunctionComponent>

export const Default: Story = {
  name: 'displayOnFocus',
  render: () => (
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
  ),
  play: async () => {
    await screen.findByRole('button') // Wait for first render
    userEvent.tab()
  },
}
