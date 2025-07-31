import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { StepDots } from './StepDots'

const meta: Meta<typeof StepDots> = {
  title: 'ui/StepDots',
  component: StepDots,
}
export default meta

const baseProps = {
  numberOfSteps: 4,
}

const variantConfig: Variants<typeof StepDots> = [
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

export const Template: VariantsStory<typeof StepDots> = {
  name: 'StepDots',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={StepDots} defaultProps={{ ...props }} />
  ),
}
