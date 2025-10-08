import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { EmailInput } from './EmailInput'

const meta: Meta<typeof EmailInput> = {
  title: 'ui/inputs/EmailInput',
  component: EmailInput,
}
export default meta

const baseProps = {
  label: 'Adresse e-mail',
}

const variantConfig: Variants<typeof EmailInput> = [
  {
    label: 'EmailInput',
    props: baseProps,
  },
  {
    label: 'EmailInput with value',
    props: { ...baseProps, email: 'email@example.com' },
  },
  {
    label: 'EmailInput Required',
    props: { ...baseProps, requiredIndicator: 'explicit' },
  },
  {
    label: 'EmailInput Disabled',
    props: { ...baseProps, disabled: true },
  },
  {
    label: ' EmailInput with Error',
    props: { ...baseProps, errorMessage: 'Erreur' },
  },
]

export const Template: VariantsStory<typeof EmailInput> = {
  name: 'EmailInput',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={EmailInput} defaultProps={{ ...props }} />
  ),
}
