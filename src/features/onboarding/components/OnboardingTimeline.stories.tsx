import type { Meta } from '@storybook/react'
import React from 'react'

import { ANIMATION_DELAY } from 'features/home/api/useShowSkeleton'
import { Variants, VariantsStory, VariantsTemplate } from 'ui/storybook/VariantsTemplate'

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

const variantConfig: Variants<typeof OnboardingTimeline> = [
  {
    label: 'OnboardingTimeline Eighteen',
    props: { age: 18 },
  },
  {
    label: 'OnboardingTimeline Seventeen',
    props: { age: 17 },
  },
  {
    label: 'OnboardingTimeline Sixteen',
    props: { age: 16 },
  },
  {
    label: 'OnboardingTimeline Fifteen',
    props: { age: 15 },
  },
]

export const Template: VariantsStory<typeof OnboardingTimeline> = {
  name: 'OnboardingTimeline',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={OnboardingTimeline}
      defaultProps={{ ...props }}
    />
  ),
}
