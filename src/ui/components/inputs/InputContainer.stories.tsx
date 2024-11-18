import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'

import { InputContainer } from './InputContainer'

const meta: ComponentMeta<typeof InputContainer> = {
  title: 'ui/inputs/InputContainer',
  component: InputContainer,
}
export default meta

const variantConfig = [
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

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={InputContainer} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'InputContainer'
