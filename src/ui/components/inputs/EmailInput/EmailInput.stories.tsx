import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { EmailInput } from './EmailInput'

const meta: Meta<typeof EmailInput> = {
  title: 'ui/inputs/EmailInput',
  component: EmailInput,
}
export default meta

const variantConfig: Variants<typeof EmailInput> = [
  {
    label: 'EmailInput',
  },
  {
    label: 'EmailInput with label',
    props: { label: 'Adresse e-mail' },
  },
  {
    label: 'EmailInput with label and value',
    props: { label: 'Adresse e-mail', email: 'email@example.com' },
  },
  {
    label: 'EmailInput Required',
    props: { label: 'Adresse e-mail', isRequiredField: true },
  },
  {
    label: 'EmailInput Disabled',
    props: { label: 'Adresse e-mail', disabled: true },
  },
  {
    label: ' EmailInput with Error',
    props: { label: 'Adresse e-mail', isError: true },
  },
]

export const Template: VariantsStory<typeof EmailInput> = {
  name: 'EmailInput',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={EmailInput} defaultProps={{ ...props }} />
  ),
}
