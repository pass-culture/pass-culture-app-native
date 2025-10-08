import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { LargeTextInput } from './LargeTextInput'

const meta: Meta<typeof LargeTextInput> = {
  title: 'ui/inputs/LargeTextInput',
  component: LargeTextInput,
}
export default meta

const textWith801Character = 'a'.repeat(801)

const baseProps = { label: 'Label', placeholder: 'Placeholder...' }

const variantConfig: Variants<typeof LargeTextInput> = [
  {
    label: 'LargeTextInput',
    props: { ...baseProps },
  },
  {
    label: 'LargeTextInput with value',
    props: { ...baseProps, value: 'Value...' },
  },
  {
    label: 'Required LargeTextInput',
    props: { ...baseProps, required: 'text' },
  },
  {
    label: 'Disabled LargeTextInput',
    props: { ...baseProps, disabled: true },
  },
  {
    label: ' LargeTextInput with Error',
    props: { ...baseProps, errorMessage: 'Error', value: textWith801Character },
  },
]

export const Template: VariantsStory<typeof LargeTextInput> = {
  name: 'LargeTextInput',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={LargeTextInput}
      defaultProps={{ ...props }}
    />
  ),
}
