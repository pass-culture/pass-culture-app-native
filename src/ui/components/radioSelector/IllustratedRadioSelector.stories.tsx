import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { BicolorRingingBell } from 'ui/svg/BicolorRingingBell'

import { IllustratedRadioSelector } from './IllustratedRadioSelector'

const meta: ComponentMeta<typeof IllustratedRadioSelector> = {
  title: 'ui/inputs/IllustratedRadioSelector',
  component: IllustratedRadioSelector,
  argTypes: {
    onPress: { control: { disable: true } },
  },
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const Template: ComponentStory<typeof IllustratedRadioSelector> = (args) => (
  <IllustratedRadioSelector {...args} />
)
export const Default = Template.bind({})
Default.args = {
  label: 'Lorem ipsum dolor sit amet consectetur ac.',
  disabled: false,
  checked: false,
  accessibilityLabel: '',
  Illustration: () => <BicolorRingingBell />,
}

export const IsActive = Template.bind({})
IsActive.args = {
  ...Default.args,
  checked: true,
}

export const IsDisabled = Template.bind({})
IsDisabled.args = {
  ...Default.args,
  disabled: true,
}
