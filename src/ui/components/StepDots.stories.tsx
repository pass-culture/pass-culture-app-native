import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { StepDots } from './StepDots'

export default {
  title: 'ui/StepDots',
  component: StepDots,
} as ComponentMeta<typeof StepDots>

const Template: ComponentStory<typeof StepDots> = (props) => <StepDots {...props} />

export const WithFirstCurrentStep = Template.bind({})
WithFirstCurrentStep.args = {
  numberOfSteps: 4,
  currentStep: 1,
}

export const WithThirdCurrentStep = Template.bind({})
WithThirdCurrentStep.args = {
  numberOfSteps: 4,
  currentStep: 3,
}

export const WithLastCurrentStep = Template.bind({})
WithLastCurrentStep.args = {
  numberOfSteps: 4,
  currentStep: 4,
}
