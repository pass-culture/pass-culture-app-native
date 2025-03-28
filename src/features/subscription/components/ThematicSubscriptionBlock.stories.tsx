import { NavigationContainer } from '@react-navigation/native'
import { Meta } from '@storybook/react'
import React from 'react'

import { SubscriptionTheme } from 'features/subscription/types'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { ThematicSubscriptionBlock } from './ThematicSubscriptionBlock'

const meta: Meta<typeof ThematicSubscriptionBlock> = {
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

const variantConfig: Variants<typeof ThematicSubscriptionBlock> = [
  {
    label: 'ThematicSubscriptionBlock inactive',
    props: { thematic: SubscriptionTheme.CINEMA, isSubscribeButtonActive: false },
  },
  {
    label: 'ThematicSubscriptionBlock active',
    props: { thematic: SubscriptionTheme.MUSIQUE, isSubscribeButtonActive: true },
  },
]

const Template: VariantsStory<typeof ThematicSubscriptionBlock> = (args) => (
  <VariantsTemplate
    variants={variantConfig}
    Component={ThematicSubscriptionBlock}
    defaultProps={{ ...args }}
  />
)

export const AllVariants = Template.bind({})
AllVariants.parameters = { axe: { disabledRules: ['duplicate-id'] } }
// duplicate-id on bell icon (SVG) on CTA, we disable this rule for these stories since we never have more than one ThematicSubscriptionBlock on a page.
