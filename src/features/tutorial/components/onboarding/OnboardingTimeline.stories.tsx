import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { ANIMATION_DELAY } from 'features/home/api/useShowSkeleton'

import { OnboardingTimeline } from './OnboardingTimeline'

const meta: ComponentMeta<typeof OnboardingTimeline> = {
  title: 'features/tutorial/OnboardingTimeline',
  component: OnboardingTimeline,
  parameters: {
    // Wait for animation to finish before snapshot
    chromatic: { delay: ANIMATION_DELAY },
  },
}
export default meta

const Template: ComponentStory<typeof OnboardingTimeline> = (props) => (
  <OnboardingTimeline {...props} />
)
export const Eighteen = Template.bind({})
Eighteen.args = {
  age: 18,
}

export const Seventeen = Template.bind({})
Seventeen.args = {
  age: 17,
}
export const Sixteen = Template.bind({})
Sixteen.args = {
  age: 16,
}

export const Fifteen = Template.bind({})
Fifteen.args = {
  age: 15,
}
