import type { Meta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { InputContainer } from './InputContainer'

const meta: Meta<typeof InputContainer> = {
  title: 'ui/inputs/InputContainer',
  component: InputContainer,
}
export default meta

const variantConfig: Variants<typeof InputContainer> = [
  {
    label: 'InputContainer',
  },
  {
    label: 'InputContainer focus',
    props: { isFocus: true },
  },
  {
    label: 'InputContainer with Error',
    props: { isError: true },
  },

  {
    label: 'Disabled InputContainer',
    props: { isDisabled: true },
  },
]

const Template: VariantsStory<typeof InputContainer> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={InputContainer} defaultProps={args} />
)

export const AllVariants = Template.bind({})
