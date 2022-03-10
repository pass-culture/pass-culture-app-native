import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { StyledInputContainer } from './StyledInputContainer'

export default {
  title: 'ui/inputs/StyledInputContainer',
  component: StyledInputContainer,
} as ComponentMeta<typeof StyledInputContainer>

const Template: ComponentStory<typeof StyledInputContainer> = (args) => (
  <StyledInputContainer {...args} />
)

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
