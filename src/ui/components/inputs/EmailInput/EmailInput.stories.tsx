import { Meta } from '@storybook/react'
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
    label: 'Input Email',
  },
  {
    label: 'Input Email with label',
    props: { label: 'Adresse e-mail' },
  },
  {
    label: 'Input Email with label and value',
    props: { label: 'Adresse e-mail', email: 'email@example.com' },
  },
  {
    label: 'Required Input Email',
    props: { label: 'Adresse e-mail', isRequiredField: true },
  },
  {
    label: 'Disabled Input Email',
    props: { label: 'Adresse e-mail', disabled: true },
  },
  {
    label: ' Input Email with Error',
    props: { label: 'Adresse e-mail', isError: true },
  },
]

const Template: VariantsStory<typeof EmailInput> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={EmailInput} defaultProps={{ ...args }} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'EmailInput'
