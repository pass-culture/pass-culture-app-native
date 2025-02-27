import { Meta, StoryObj } from '@storybook/react'
import { userEvent, screen } from '@storybook/test'
import React, { Fragment } from 'react'

import { TypoDS } from 'ui/theme'

import { QuickAccess } from './QuickAccess'

const meta: Meta<typeof QuickAccess> = {
  title: 'ui/accessibility/QuickAccess',
  component: QuickAccess,
}
export default meta

type Story = StoryObj<typeof QuickAccess>

const caption = 'QuickAccess'
const body = ' is a component that should be visible only when giving focus'

export const Default: Story = {
  name: 'QuickAccess',
  args: {
    href: '#',
    title: 'Go to link',
  },
  render: (args) => (
    <Fragment>
      <TypoDS.Body>
        <TypoDS.BodyAccentXs>{caption}</TypoDS.BodyAccentXs>
        {body}
      </TypoDS.Body>
      <QuickAccess {...args} />
    </Fragment>
  ),
  play: async () => {
    await screen.findByRole('link') // Wait for first render
    userEvent.tab()
  },
}
