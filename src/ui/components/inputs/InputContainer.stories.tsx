import type { Meta } from '@storybook/react-vite'
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

export const Template: VariantsStory<typeof InputContainer> = {
  name: 'InputContainer',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={InputContainer} defaultProps={props} />
  ),
}
