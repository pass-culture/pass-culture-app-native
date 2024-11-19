import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { SubscriptionTheme } from 'features/subscription/types'
import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'

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

const variantConfig = [
  {
    label: 'ThematicSubscriptionBlock inactive',
    props: { thematic: SubscriptionTheme.CINEMA, isSubscribeButtonActive: false },
  },
  {
    label: 'ThematicSubscriptionBlock active',
    props: { thematic: SubscriptionTheme.CINEMA, isSubscribeButtonActive: true },
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={ThematicSubscriptionBlock} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'ThematicSubscriptionBlock'
