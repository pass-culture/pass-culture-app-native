import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { RadioSelector } from './RadioSelector'

export default {
  title: 'ui/inputs/RadioSelector',
  component: RadioSelector,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
} as ComponentMeta<typeof RadioSelector>

const Template: ComponentStory<typeof RadioSelector> = (args) => <RadioSelector {...args} />
export const Default = Template.bind({})
Default.args = {
  label: 'Lorem ipsum dolor sit amet consectetur ac.',
  description: '1 place restante',
  rightText: `35\u00a0€`,
  disabled: false,
  checked: false,
  testID: '',
  accessibilityLabel: '',
}
Default.storyName = 'RadioSelector Default Mode'

export const IsActive = Template.bind({})
IsActive.args = {
  ...Default.args,
  checked: true,
}
IsActive.storyName = 'RadioSelector Active Mode'

export const IsDisabled = Template.bind({})
IsDisabled.args = {
  ...Default.args,
  disabled: true,
}
IsDisabled.storyName = 'RadioSelector Disabled Mode'

export const WithoutDescription = Template.bind({})
WithoutDescription.args = {
  ...Default.args,
  description: '',
}
WithoutDescription.storyName = 'RadioSelector Default Mode without description'

export const WithoutPrice = Template.bind({})
WithoutPrice.args = {
  ...Default.args,
  rightText: '',
}
WithoutPrice.storyName = 'RadioSelector Default Mode without price'
