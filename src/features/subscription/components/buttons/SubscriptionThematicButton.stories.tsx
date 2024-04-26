import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { SubscriptionTheme } from 'features/subscription/types'

import { SubscriptionThematicButton } from './SubscriptionThematicButton'

const meta: ComponentMeta<typeof SubscriptionThematicButton> = {
  title: 'Features/subscription/SubscriptionThematicButton',
  component: SubscriptionThematicButton,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const Template: ComponentStory<typeof SubscriptionThematicButton> = (props) => (
  <SubscriptionThematicButton {...props} />
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
