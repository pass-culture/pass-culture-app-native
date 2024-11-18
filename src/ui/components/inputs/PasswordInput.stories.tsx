import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'

import { PasswordInput } from './PasswordInput'

const meta: ComponentMeta<typeof PasswordInput> = {
  title: 'ui/inputs/PasswordInput',
  component: PasswordInput,
}
export default meta

const variantConfig = [
  {
    label: 'PasswordInput',
  },
  {
    label: 'PasswordInput with custom label and placeholder',
    props: { label: 'Custom label', placeholder: 'Custom placeholder...' },
  },
  {
    label: 'PasswordInput with value',
    props: { value: 'password' },
  },
  {
    label: 'PasswordInput required',
    props: { isRequiredField: true },
  },
  {
    label: 'PasswordInput with Error',
    props: { isError: true },
  },

  {
    label: 'Disabled PasswordInput',
    props: { disabled: true },
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={PasswordInput} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'PasswordInput'
