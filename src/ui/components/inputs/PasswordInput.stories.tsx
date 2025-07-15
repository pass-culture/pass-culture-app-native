import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { PasswordInput } from './PasswordInput'

const meta: Meta<typeof PasswordInput> = {
  title: 'ui/inputs/PasswordInput',
  component: PasswordInput,
}
export default meta

const variantConfig: Variants<typeof PasswordInput> = [
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

export const Template: VariantsStory<typeof PasswordInput> = {
  name: 'PasswordInput',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={PasswordInput}
      defaultProps={{ ...props }}
    />
  ),
}
