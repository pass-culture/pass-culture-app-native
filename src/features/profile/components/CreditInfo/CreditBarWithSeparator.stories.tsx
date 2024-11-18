import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'

import { CreditBarWithSeparator } from './CreditBarWithSeparator'

export default {
  title: 'Features/Profile/CreditBarWithSeparator',
  component: CreditBarWithSeparator,
} as ComponentMeta<typeof CreditBarWithSeparator>

const variantConfig = [
  {
    label: 'CreditBarWithSeparator: OneInThree',
    props: {
      currentStep: 1,
      totalStep: 3,
    },
    withBackground: true,
  },
  {
    label: 'CreditBarWithSeparator: TwoInThree',
    props: {
      currentStep: 2,
      totalStep: 3,
    },
    withBackground: true,
  },
  {
    label: 'CreditBarWithSeparator: ThreeInThree',
    props: {
      currentStep: 3,
      totalStep: 3,
    },
    withBackground: true,
  },
  {
    label: 'CreditBarWithSeparator: OneInTwo',
    props: {
      currentStep: 1,
      totalStep: 2,
    },
    withBackground: true,
  },
  {
    label: 'CreditBarWithSeparator: TwoInTwo',
    props: {
      currentStep: 2,
      totalStep: 2,
    },
    withBackground: true,
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={CreditBarWithSeparator} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'CreditBarWithSeparator'
