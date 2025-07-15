import type { Meta, StoryObj } from '@storybook/react-vite'
import { userEvent, screen } from '@storybook/testing-library'
import React, { Fragment } from 'react'

import { Typo } from 'ui/theme'

import { QuickAccess } from './QuickAccess'

const meta: Meta<typeof QuickAccess> = {
  title: 'ui/accessibility/QuickAccess',
  component: QuickAccess,
}
export default meta

type Story = StoryObj<typeof QuickAccess>

const caption = 'QuickAccess'
const body = ' is a component that should be visible only when giving focus'

const StoryComponent = (props: React.ComponentProps<typeof QuickAccess>) => (
  <Fragment>
    <Typo.Body>
      <Typo.BodyAccentXs>{caption}</Typo.BodyAccentXs>
      {body}
    </Typo.Body>
    <QuickAccess {...props} />
  </Fragment>
)

export const Default: Story = {
  render: (props) => <StoryComponent {...props} />,
  args: {
    href: '#',
    title: 'Go to link',
  },
  name: 'QuickAccess',
  play: async () => {
    await screen.findByRole('link') // wait first render

    userEvent.tab()
  },
}
