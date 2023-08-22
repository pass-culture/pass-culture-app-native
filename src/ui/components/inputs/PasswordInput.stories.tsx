import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { PasswordInput } from './PasswordInput'

const meta: ComponentMeta<typeof PasswordInput> = {
  title: 'ui/inputs/PasswordInput',
  component: PasswordInput,
}
export default meta

const Template: ComponentStory<typeof PasswordInput> = (args) => <PasswordInput {...args} />

export const Default = Template.bind({})
Default.args = {}

export const WithCustomLabelAndPlaceholder = Template.bind({})
WithCustomLabelAndPlaceholder.args = {
  label: 'Custom label',
  placeholder: 'Custom placeholder...',
}

export const WithValue = Template.bind({})
WithValue.args = {
  value: 'password',
}

export const Required = Template.bind({})
Required.args = {
  isRequiredField: true,
}

export const Disabled = Template.bind({})
Disabled.args = {
  disabled: true,
}

export const Error = Template.bind({})
Error.args = {
  isError: true,
}
