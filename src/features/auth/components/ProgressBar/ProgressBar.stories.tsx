import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { Variants, VariantsStory, VariantsTemplate } from 'ui/storybook/VariantsTemplate'

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

const variantConfig: Variants<typeof ProgressBar> = [
  {
    label: 'ProgressBar FirstStep',
    props: { totalStep: 5, currentStep: 0 },
  },
  {
    label: 'ProgressBar SecondStep',
    props: { totalStep: 5, currentStep: 1 },
  },
  {
    label: 'ProgressBar LastStep',
    props: { totalStep: 5, currentStep: 5 },
  },
]

export const Template: VariantsStory<typeof ProgressBar> = {
  name: 'ProgressBar',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={ProgressBar}
      defaultProps={{ ...props }}
    />
  ),
}
