import { StoryObj, Meta } from '@storybook/react'
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

const Template: StoryObj<typeof OnboardingTimeline> = (props) => (
  <OnboardingTimeline {...props} />
)
//TODO(PC-28526): Fix this stories
const Eighteen = Template.bind({})
Eighteen.args = {
  age: 18,
}

//TODO(PC-28526): Fix this stories
const Seventeen = Template.bind({})
Seventeen.args = {
  age: 17,
}
//TODO(PC-28526): Fix this stories
const Sixteen = Template.bind({})
Sixteen.args = {
  age: 16,
}

//TODO(PC-28526): Fix this stories
const Fifteen = Template.bind({})
Fifteen.args = {
  age: 15,
}
