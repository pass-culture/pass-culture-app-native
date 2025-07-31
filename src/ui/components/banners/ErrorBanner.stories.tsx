import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { ErrorBanner } from './ErrorBanner'

const meta: Meta<typeof ErrorBanner> = {
  title: 'ui/banners/ErrorBanner',
  component: ErrorBanner,
}
export default meta

type Story = StoryObj<typeof ErrorBanner>

export const Default: Story = {
  render: (props) => <ErrorBanner {...props} />,
  name: 'ErrorBanner',
  args: {
    message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
  },
}
