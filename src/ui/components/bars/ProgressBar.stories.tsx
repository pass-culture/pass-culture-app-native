import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { theme } from 'theme'

import { ProgressBar } from './ProgressBar'

const meta: Meta<typeof ProgressBar> = {
  title: 'ui/progressBars/ProgressBar',
  component: ProgressBar,
}
export default meta

type Story = StoryObj<typeof ProgressBar>

//TODO(PC-28526): Fix this stories
export const Default: Story = {
  render: (props) => <ProgressBar {...props} />,
  args: {
    progress: 0.5,
    colors: [theme.colors.primary, theme.colors.secondary],
  },
}

//TODO(PC-28526): Fix this stories
export const Empty: Story = {
  render: (props) => <ProgressBar {...props} />,
  args: {
    progress: 0,
    colors: [theme.colors.greenLight],
  },
}

//TODO(PC-28526): Fix this stories
export const Full: Story = {
  render: (props) => <ProgressBar {...props} />,
  args: {
    progress: 1,
    colors: [theme.colors.error],
  },
}
