import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'
import { Eye } from 'ui/svg/icons/Eye'

import { TextInput } from './TextInput'

const meta: ComponentMeta<typeof TextInput> = {
  title: 'ui/inputs/TextInput',
  component: TextInput,
}
export default meta

const baseProps = { placeholder: 'Placeholder...', label: 'Label' }

const variantConfig = [
  {
    label: 'TextInput',
    props: { placeholder: 'Placeholder...' },
  },
  {
    label: 'TextInput with label',
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

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={TextInput} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'TextInput'
