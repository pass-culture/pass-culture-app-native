import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { OnboardingTimeline } from './OnboardingTimeline'

export default {
  title: 'features/onboarding/OnboardingTimeline',
  component: OnboardingTimeline,
} as ComponentMeta<typeof OnboardingTimeline>

const Template: ComponentStory<typeof OnboardingTimeline> = (props) => (
  <OnboardingTimeline {...props} />
)
export const Eighteen = Template.bind({})
Eighteen.args = {
  age: 18,
}

export const Fifteen = Template.bind({})
Fifteen.args = {
  age: 15,
}
