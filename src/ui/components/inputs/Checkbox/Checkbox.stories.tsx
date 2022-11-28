import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { Checkbox } from './Checkbox'

export default {
  title: 'ui/inputs/Checkbox',
  component: Checkbox,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
} as ComponentMeta<typeof Checkbox>

const Template: ComponentStory<typeof Checkbox> = (args) => <Checkbox {...args} />

export const NotChecked = Template.bind({})
NotChecked.args = {
  label: 'I agree to disagree',
  isChecked: false,
}

export const IsChecked = Template.bind({})
IsChecked.args = {
  label: 'I agree to disagree',
  isChecked: true,
}
