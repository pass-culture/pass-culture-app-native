import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { Eye } from 'ui/svg/icons/Eye'

import { TextInput } from './TextInput'

export default {
  title: 'ui/inputs/TextInput',
  component: TextInput,
} as ComponentMeta<typeof TextInput>

const Template: ComponentStory<typeof TextInput> = (args) => <TextInput {...args} />

export const Default = Template.bind({})
Default.args = {
  placeholder: 'Placeholder...',
}

export const WithLabel = Template.bind({})
WithLabel.args = {
  label: 'Label',
  placeholder: 'Placeholder...',
}

export const Required = Template.bind({})
Required.args = {
  label: 'Label',
  placeholder: 'Placeholder...',
  isRequiredField: true,
}

export const Disabled = Template.bind({})
Disabled.args = {
  label: 'Label',
  placeholder: 'Placeholder...',
  disabled: true,
}

export const Error = Template.bind({})
Error.args = {
  label: 'Label',
  placeholder: 'Placeholder...',
  isError: true,
}

export const WithInsideRightButton = Template.bind({})
WithInsideRightButton.args = {
  label: 'Label',
  placeholder: 'Placeholder...',
  rightButton: {
    icon: Eye,
    onPress: () => alert('Do nothing'),
    accessibilityLabel: 'Afficher le mot de passe',
  },
}
