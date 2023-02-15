import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { RadioSelecteur, RadioSelecteurType } from './RadioSelecteur'

export default {
  title: 'ui/inputs/RadioSelecteur',
  component: RadioSelecteur,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
} as ComponentMeta<typeof RadioSelecteur>

const Template: ComponentStory<typeof RadioSelecteur> = (props) => <RadioSelecteur {...props} />
export const Default = Template.bind({})
Default.args = {
  type: RadioSelecteurType.DEFAULT,
  label: 'Lorem ipsum dolor sit amet consectetur ac.',
  description: '1 place restante',
  price: '35',
}
Default.storyName = 'RadioSelecteur Default Mode'

export const IsActive = Template.bind({})
IsActive.args = {
  type: RadioSelecteurType.ACTIVE,
  label: 'Lorem ipsum dolor sit amet consectetur ac.',
  description: '1 place restante',
  price: '35',
}
IsActive.storyName = 'RadioSelecteur Active Mode'

export const IsDisabled = Template.bind({})
IsDisabled.args = {
  type: RadioSelecteurType.DISABLED,
  label: 'Lorem ipsum dolor sit amet consectetur ac.',
  description: '1 place restante',
  price: '35',
}
IsDisabled.storyName = 'RadioSelecteur Disabled Mode'

export const WithoutDescription = Template.bind({})
WithoutDescription.args = {
  type: RadioSelecteurType.DEFAULT,
  label: 'Lorem ipsum dolor sit amet consectetur ac.',
  price: '35',
}
WithoutDescription.storyName = 'RadioSelecteur Default Mode without description'

export const WithoutPrice = Template.bind({})
WithoutPrice.args = {
  type: RadioSelecteurType.DEFAULT,
  label: 'Lorem ipsum dolor sit amet consectetur ac.',
  description: '1 place restante',
}
WithoutPrice.storyName = 'RadioSelecteur Default Mode without price'
