import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { ANIMATION_DELAY } from 'features/home/api/useShowSkeleton'

import { OnboardingTimeline } from './OnboardingTimeline'

const meta: Meta<typeof OnboardingTimeline> = {
  title: 'features/tutorial/OnboardingTimeline',
  component: OnboardingTimeline,
  parameters: {
    // Wait for animation to finish before snapshot
    chromatic: { delay: ANIMATION_DELAY },
  },
}
export default meta

type Story = StoryObj<typeof OnboardingTimeline>

export const Eighteen: Story = {
  render: (props) => <OnboardingTimeline {...props} />,
  args: {
    age: 18,
  },
}

export const Seventeen: Story = {
  render: (props) => <OnboardingTimeline {...props} />,
  args: {
    age: 17,
  },
}

export const Sixteen: Story = {
  render: (props) => <OnboardingTimeline {...props} />,
  args: {
    age: 16,
  },
}

export const Fifteen: Story = {
  render: (props) => <OnboardingTimeline {...props} />,
  args: {
    age: 15,
  },
}
