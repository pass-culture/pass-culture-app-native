import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { WarningBanner } from './WarningBanner'

const meta: Meta<typeof WarningBanner> = {
  title: 'ui/banners/WarningBanner',
  component: WarningBanner,
}
export default meta

type Story = StoryObj<typeof WarningBanner>

export const Default: Story = {
  render: (props) => <WarningBanner {...props} />,
  name: 'WarningBanner',
  args: {
    message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
  },
}
