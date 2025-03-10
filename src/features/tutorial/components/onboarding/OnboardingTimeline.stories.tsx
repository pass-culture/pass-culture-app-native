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

//TODO(PC-28526): Fix this stories
export const Eighteen: Story = {
  render: (props) => <OnboardingTimeline {...props} />,
  args: {
    age: 18,
  },
}

//TODO(PC-28526): Fix this stories
export const Seventeen: Story = {
  render: (props) => <OnboardingTimeline {...props} />,
  args: {
    age: 17,
  },
}

//TODO(PC-28526): Fix this stories
export const Sixteen: Story = {
  render: (props) => <OnboardingTimeline {...props} />,
  args: {
    age: 16,
  },
}

//TODO(PC-28526): Fix this stories
export const Fifteen: Story = {
  render: (props) => <OnboardingTimeline {...props} />,
  args: {
    age: 15,
  },
}
