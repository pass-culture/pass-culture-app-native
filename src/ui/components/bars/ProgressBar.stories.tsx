import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { Variants, VariantsStory, VariantsTemplate } from 'ui/storybook/VariantsTemplate'

import { ProgressBar } from './ProgressBar'

const meta: Meta<typeof ProgressBar> = {
  title: 'ui/progressBars/ProgressBar',
  component: ProgressBar,
}
export default meta

const variantConfig: Variants<typeof ProgressBar> = [
  {
    label: 'ProgressBar Default',
    props: { progress: 0.5 },
  },
  {
    label: 'ProgressBar Empty',
    props: { progress: 0 },
  },
  {
    label: 'ProgressBar Full',
    props: { progress: 1 },
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
