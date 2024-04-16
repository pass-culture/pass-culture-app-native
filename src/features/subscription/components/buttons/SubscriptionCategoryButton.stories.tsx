import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { SubscriptionTheme } from 'features/subscription/types'

import { SubscriptionCategoryButton } from './SubscriptionCategoryButton'

const meta: ComponentMeta<typeof SubscriptionCategoryButton> = {
  title: 'Features/subscription/SubscriptionCategoryButton',
  component: SubscriptionCategoryButton,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const Template: ComponentStory<typeof SubscriptionCategoryButton> = (props) => (
  <SubscriptionCategoryButton {...props} />
)

export const Default = Template.bind({})
Default.args = {
  thematic: SubscriptionTheme.CINEMA,
  checked: false,
}

export const Checked = Template.bind({})
Checked.args = {
  thematic: SubscriptionTheme.CINEMA,
  checked: true,
}
