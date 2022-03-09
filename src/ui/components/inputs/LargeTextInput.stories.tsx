import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { LargeTextInput } from './LargeTextInput'

export default {
  title: 'ui/inputs/LargeTextInput',
  component: LargeTextInput,
} as ComponentMeta<typeof LargeTextInput>

const Template: ComponentStory<typeof LargeTextInput> = (args) => <LargeTextInput {...args} />

export const Default = Template.bind({})
Default.args = {
  placeholder: 'Placeholder...',
}

export const WithLabel = Template.bind({})
WithLabel.args = {
  label: 'Label',
  placeholder: 'Placeholder...',
}

export const Error = Template.bind({})
Error.args = {
  label: 'Label',
  placeholder: 'Placeholder...',
  isError: true,
}

export const Disabled = Template.bind({})
Disabled.args = {
  label: 'Label',
  placeholder: 'Placeholder...',
  disabled: true,
}
