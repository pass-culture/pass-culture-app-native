import type { Meta } from '@storybook/react'
import React from 'react'

import { theme } from 'theme'
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
    props: { progress: 0.5, colors: [theme.colors.primary, theme.colors.secondary] },
  },
  {
    label: 'ProgressBar Empty',
    props: { progress: 0, colors: [theme.colors.greenLight] },
  },
  {
    label: 'ProgressBar Full',
    props: { progress: 1, colors: [theme.colors.error] },
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
