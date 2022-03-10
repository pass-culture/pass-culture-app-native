import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { PasswordInput } from './PasswordInput'

export default {
  title: 'ui/inputs/PasswordInput',
  component: PasswordInput,
} as ComponentMeta<typeof PasswordInput>

const Template: ComponentStory<typeof PasswordInput> = (args) => <PasswordInput {...args} />

export const Default = Template.bind({})
Default.args = {}

export const WithLabel = Template.bind({})
WithLabel.args = {
  label: 'Label',
  placeholder: 'Placeholder...',
}

export const WithValue = Template.bind({})
WithValue.args = {
  label: 'Adresse e-mail',
  value: 'password',
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
