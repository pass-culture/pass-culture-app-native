import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { StepDots } from './StepDots'

const meta: ComponentMeta<typeof StepDots> = {
  title: 'ui/StepDots',
  component: StepDots,
}
export default meta

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

export const WithNeutralPreviousStepsColor = Template.bind({})
WithNeutralPreviousStepsColor.args = {
  numberOfSteps: 4,
  currentStep: 3,
  withNeutralPreviousStepsColor: true,
}
