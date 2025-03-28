import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { AlertBanner } from './AlertBanner'

const meta: Meta<typeof AlertBanner> = {
  title: 'ui/banners/AlertBanner',
  component: AlertBanner,
}
export default meta

type Story = StoryObj<typeof AlertBanner>

export const Default: Story = {
  render: (props) => <AlertBanner {...props} />,
  name: 'AlertBanner',
  args: {
    message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
  },
}
