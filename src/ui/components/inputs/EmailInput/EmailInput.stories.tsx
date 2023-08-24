import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { EmailInput } from './EmailInput'

const meta: ComponentMeta<typeof EmailInput> = {
  title: 'ui/inputs/EmailInput',
  component: EmailInput,
}
export default meta

const Template: ComponentStory<typeof EmailInput> = (args) => <EmailInput {...args} />

export const Default = Template.bind({})
Default.args = {}

export const WithLabel = Template.bind({})
WithLabel.args = {
  label: 'Adresse e-mail',
}

export const WithValue = Template.bind({})
WithValue.args = {
  label: 'Adresse e-mail',
  email: 'email@example.com',
}

export const Required = Template.bind({})
Required.args = {
  label: 'Adresse e-mail',
  isRequiredField: true,
}

export const Disabled = Template.bind({})
Disabled.args = {
  label: 'Adresse e-mail',
  disabled: true,
}

export const Error = Template.bind({})
Error.args = {
  label: 'Adresse e-mail',
  isError: true,
}
