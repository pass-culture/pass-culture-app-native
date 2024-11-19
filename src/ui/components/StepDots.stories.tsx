import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'

import { StepDots } from './StepDots'

const meta: ComponentMeta<typeof StepDots> = {
  title: 'ui/StepDots',
  component: StepDots,
}
export default meta

const baseProps = {
  numberOfSteps: 4,
}

const variantConfig = [
  {
    label: 'StepDots with first current step',
    props: { ...baseProps, currentStep: 1 },
  },
  {
    label: 'StepDots with third current step',
    props: { ...baseProps, currentStep: 3 },
  },
  {
    label: 'StepDots with last current step',
    props: { ...baseProps, currentStep: 4 },
  },
  {
    label: 'StepDots with neutral previous steps color',
    props: { ...baseProps, currentStep: 3, withNeutralPreviousStepsColor: true },
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={StepDots} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'StepDots'
