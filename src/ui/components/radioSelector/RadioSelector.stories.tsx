import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { RadioSelector, RadioSelectorType } from './RadioSelector'

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
  type: RadioSelectorType.DEFAULT,
  label: 'Lorem ipsum dolor sit amet consectetur ac.',
  description: '1 place restante',
  price: `35\u00a0€`,
}
Default.storyName = 'RadioSelector Default Mode'

export const IsActive = Template.bind({})
IsActive.args = {
  type: RadioSelectorType.ACTIVE,
  label: 'Lorem ipsum dolor sit amet consectetur ac.',
  description: '1 place restante',
  price: '35\u00a0€',
}
IsActive.storyName = 'RadioSelector Active Mode'

export const IsDisabled = Template.bind({})
IsDisabled.args = {
  type: RadioSelectorType.DISABLED,
  label: 'Lorem ipsum dolor sit amet consectetur ac.',
  description: '1 place restante',
  price: '35\u00a0€',
}
IsDisabled.storyName = 'RadioSelector Disabled Mode'

export const WithoutDescription = Template.bind({})
WithoutDescription.args = {
  type: RadioSelectorType.DEFAULT,
  label: 'Lorem ipsum dolor sit amet consectetur ac.',
  price: '35\u00a0€',
}
WithoutDescription.storyName = 'RadioSelector Default Mode without description'

export const WithoutPrice = Template.bind({})
WithoutPrice.args = {
  type: RadioSelectorType.DEFAULT,
  label: 'Lorem ipsum dolor sit amet consectetur ac.',
  description: '1 place restante',
}
WithoutPrice.storyName = 'RadioSelector Default Mode without price'
