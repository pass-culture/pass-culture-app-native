import type { Meta, StoryObj } from '@storybook/react'
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

const StoryComponent = (props: React.ComponentProps<typeof QuickAccess>) => (
  <Fragment>
    <TypoDS.Body>
      <TypoDS.BodyAccentXs>{caption}</TypoDS.BodyAccentXs>
      {body}
    </TypoDS.Body>
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
