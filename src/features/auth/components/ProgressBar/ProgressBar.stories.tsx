import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { ProgressBar } from './ProgressBar'

const ANIMATION_DURATION_IN_S = 1000

const meta: Meta<typeof ProgressBar> = {
  title: 'features/auth/ProgressBar',
  component: ProgressBar,
  parameters: {
    // Wait for animation to finish before snapshot
    chromatic: { delay: ANIMATION_DURATION_IN_S },
  },
}
export default meta

type Story = StoryObj<typeof ProgressBar>

// TODO(PC-28526): Fix this stories
export const FirstStep: Story = {
  render: (props) => <ProgressBar {...props} />,
  args: {
    totalStep: 5,
    currentStep: 0,
  },
}

// TODO(PC-28526): Fix this stories
export const SecondStep: Story = {
  render: (props) => <ProgressBar {...props} />,
  args: {
    totalStep: 5,
    currentStep: 1,
  },
}

// TODO(PC-28526): Fix this stories
export const LastStep: Story = {
  render: (props) => <ProgressBar {...props} />,
  args: {
    totalStep: 5,
    currentStep: 5,
  },
}
