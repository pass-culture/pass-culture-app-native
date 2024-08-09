import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { LargeTextInput } from './LargeTextInput'

const meta: ComponentMeta<typeof LargeTextInput> = {
  title: 'ui/inputs/LargeTextInput',
  component: LargeTextInput,
}
export default meta

const Template: ComponentStory<typeof LargeTextInput> = (props) => <LargeTextInput {...props} />

export const Default = Template.bind({})
Default.args = {
  label: 'Label',
  placeholder: 'Placeholder...',
}

export const WithValue = Template.bind({})
WithValue.args = {
  label: 'Label',
  placeholder: 'Placeholder...',
  value: 'Value...',
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

const textWith801Character = 'a'.repeat(801)
export const Error = Template.bind({})
Error.args = {
  label: 'Label',
  placeholder: 'Placeholder...',
  value: textWith801Character,
  showErrorMessage: true,
  isError: true,
}
