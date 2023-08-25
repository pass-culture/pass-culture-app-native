import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { InputContainer } from './InputContainer'

const meta: ComponentMeta<typeof InputContainer> = {
  title: 'ui/inputs/InputContainer',
  component: InputContainer,
}
export default meta

const Template: ComponentStory<typeof InputContainer> = (args) => <InputContainer {...args} />

export const Default = Template.bind({})
Default.args = {}

export const Focus = Template.bind({})
Focus.args = {
  isFocus: true,
}

export const Error = Template.bind({})
Error.args = {
  isError: true,
}

export const Disabled = Template.bind({})
Disabled.args = {
  isDisabled: true,
}
