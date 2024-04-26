import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { SubscriptionTheme } from 'features/subscription/types'

import { ThematicSubscriptionBlock } from './ThematicSubscriptionBlock'

const meta: ComponentMeta<typeof ThematicSubscriptionBlock> = {
  title: 'Features/subscription/ThematicSubscriptionBlock',
  component: ThematicSubscriptionBlock,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const Template: ComponentStory<typeof ThematicSubscriptionBlock> = (props) => (
  <ThematicSubscriptionBlock {...props} />
)

export const Inactive = Template.bind({})
Inactive.args = {
  thematic: SubscriptionTheme.CINEMA,
  isSubscribeButtonActive: false,
}

export const Active = Template.bind({})
Active.args = {
  thematic: SubscriptionTheme.CINEMA,
  isSubscribeButtonActive: true,
}
