import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'

import { CreditProgressBar } from './CreditProgressBar'

const meta: ComponentMeta<typeof CreditProgressBar> = {
  title: 'Features/Profile/CreditProgressBar',
  component: CreditProgressBar,
}
export default meta

const variantConfig = [
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

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={CreditProgressBar} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'CreditProgressBar'
