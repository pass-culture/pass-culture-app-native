import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { RadioButton } from './RadioButton'

export default {
  title: 'ui/RadioButton',
  component: RadioButton,
} as ComponentMeta<typeof RadioButton>

const Template: ComponentStory<typeof RadioButton> = (args) => <RadioButton {...args} />

export const Default = Template.bind({})
Default.args = {
  id: '1',
  title: 'item 1',
}

export const WithDescription = Template.bind({})
WithDescription.args = {
  id: '1',
  title: 'item 1',
  description: 'description item 1',
}

export const WithSelectedValue = Template.bind({})
WithSelectedValue.args = {
  id: '1',
  title: 'item 1',
  selectedValue: '1',
}

export const WithSelectedValueAndDescription = Template.bind({})
WithSelectedValueAndDescription.args = {
  id: '1',
  title: 'item 1',
  selectedValue: '1',
  description: 'description item 1',
}
