import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { ProgressBar } from './ProgressBar'

export default {
  title: 'features/auth/ProgressBar',
  component: ProgressBar,
  parameters: {
    // Wait for animation to finish before snapshot
    chromatic: { delay: 1 },
  },
} as ComponentMeta<typeof ProgressBar>

const Template: ComponentStory<typeof ProgressBar> = (props) => <ProgressBar {...props} />
export const FirstStep = Template.bind({})
FirstStep.args = {
  totalStep: 5,
  currentStep: 0,
}
export const SecondStep = Template.bind({})
SecondStep.args = {
  totalStep: 5,
  currentStep: 1,
}
export const LastStep = Template.bind({})
LastStep.args = {
  totalStep: 5,
  currentStep: 5,
}
