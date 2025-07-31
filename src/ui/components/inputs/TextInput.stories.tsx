import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { Eye } from 'ui/svg/icons/Eye'

import { TextInput } from './TextInput'

const meta: Meta<typeof TextInput> = {
  title: 'ui/inputs/TextInput',
  component: TextInput,
}
export default meta

const baseProps = { placeholder: 'Placeholder...', label: 'Label' }

const variantConfig: Variants<typeof TextInput> = [
  {
    label: 'TextInput',
    props: { ...baseProps },
  },
  {
    label: 'Disabled TextInput',
    props: { ...baseProps, disabled: true },
  },
  {
    label: 'Required TextInput',
    props: { ...baseProps, isRequiredField: true },
  },
  {
    label: 'TextInput with error',
    props: { ...baseProps, isError: true },
  },
  {
    label: 'TextInput with inside rightButton',
    props: {
      ...baseProps,
      rightButton: {
        icon: Eye,
        onPress: () => alert('Do nothing'),
        accessibilityLabel: 'Afficher le mot de passe',
      },
    },
  },
]

export const Template: VariantsStory<typeof TextInput> = {
  name: 'TextInput',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={TextInput} defaultProps={{ ...props }} />
  ),
}
