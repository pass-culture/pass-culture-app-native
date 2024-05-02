import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { BicolorAroundMe } from 'ui/svg/icons/BicolorAroundMe'

import { CheckboxBlock } from './CheckboxBlock'

const meta: ComponentMeta<typeof CheckboxBlock> = {
  title: 'ui/CheckboxBlock',
  component: CheckboxBlock,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const Template: ComponentStory<typeof CheckboxBlock> = (args) => <CheckboxBlock {...args} />

export const Unchecked = Template.bind({})
Unchecked.args = {
  label: 'Label',
  checked: false,
}

export const Checked = Template.bind({})
Checked.args = {
  label: 'Label',
  checked: true,
}

export const WithSublabel = Template.bind({})
WithSublabel.args = {
  label: 'Label',
  sublabel: 'Sublabel',
  checked: false,
}

export const WithLeftIcon = Template.bind({})
WithLeftIcon.args = {
  label: 'Label',
  sublabel: 'Sublabel',
  LeftIcon: BicolorAroundMe,
  checked: false,
}
