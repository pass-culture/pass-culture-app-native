import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { SeparatorWithText } from 'ui/components/SeparatorWithText'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { StepperValidate } from 'ui/svg/icons/StepperValidate'

const meta: Meta<typeof SeparatorWithText> = {
  title: 'ui/sections/SeparatorWithText',
  component: SeparatorWithText,
}
export default meta

const baseProps = {
  label: 'label',
}

const variantConfig: Variants<typeof SeparatorWithText> = [
  {
    label: 'SeparatorWithText default',
    props: baseProps,
  },
  {
    label: 'SeparatorWithText with custom background color',
    props: { ...baseProps, color: 'primary' },
  },
  {
    label: 'SeparatorWithText with custom background color and icon',
    props: { ...baseProps, color: 'primary', icon: StepperValidate },
  },
]

export const Template: VariantsStory<typeof SeparatorWithText> = {
  name: 'SeparatorWithText',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={SeparatorWithText}
      defaultProps={{ ...props }}
    />
  ),
}
