import type { Meta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { CreditProgressBar } from './CreditProgressBar'

const meta: Meta<typeof CreditProgressBar> = {
  title: 'Features/Profile/CreditProgressBar',
  component: CreditProgressBar,
}
export default meta

const variantConfig: Variants<typeof CreditProgressBar> = [
  {
    label: 'CreditProgressBar',
    props: {
      progress: 0.5,
    },
    withBackground: true,
  },
  {
    label: 'Empty CreditProgressBar',
    props: {
      progress: 0,
    },
    withBackground: true,
  },
  {
    label: 'Full CreditProgressBar',
    props: {
      progress: 1,
    },
    withBackground: true,
  },
  {
    label: 'Small CreditProgressBar',
    props: {
      progress: 0.5,
      height: 'small',
    },
    withBackground: true,
  },
]

const Template: VariantsStory<typeof CreditProgressBar> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={CreditProgressBar} defaultProps={args} />
)

export const AllVariants = Template.bind({})
