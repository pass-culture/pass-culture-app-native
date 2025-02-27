import { StoryObj, Meta } from '@storybook/react'
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

const Template: StoryObj<typeof ProgressBar> = (props) => <ProgressBar {...props} />
//TODO(PC-28526): Fix this stories
const FirstStep = Template.bind({})
FirstStep.args = {
  totalStep: 5,
  currentStep: 0,
}

//TODO(PC-28526): Fix this stories
const SecondStep = Template.bind({})
SecondStep.args = {
  totalStep: 5,
  currentStep: 1,
}

//TODO(PC-28526): Fix this stories
const LastStep = Template.bind({})
LastStep.args = {
  totalStep: 5,
  currentStep: 5,
}
