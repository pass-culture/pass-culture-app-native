import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { CheckboxInput } from './CheckboxInput'

export default {
  title: 'ui/inputs/CheckboxInput',
  component: CheckboxInput,
} as ComponentMeta<typeof CheckboxInput>

const Template: ComponentStory<typeof CheckboxInput> = (args) => <CheckboxInput {...args} />

export const Default = Template.bind({})
Default.args = {
  isChecked: false,
}

export const IsChecked = Template.bind({})
IsChecked.args = {
  isChecked: true,
}
