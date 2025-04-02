import { NavigationContainer } from '@react-navigation/native'
import type { Meta } from '@storybook/react'
import React from 'react'

import { SubscriptionTheme } from 'features/subscription/types'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { SubscriptionThematicButton } from './SubscriptionThematicButton'

const meta: Meta<typeof SubscriptionThematicButton> = {
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

const variantConfig: Variants<typeof SubscriptionThematicButton> = [
  {
    label: 'SubscriptionThematicButton default',
    props: { thematic: SubscriptionTheme.CINEMA, checked: false },
  },
  {
    label: 'SubscriptionThematicButton checked',
    props: { thematic: SubscriptionTheme.CINEMA, checked: true },
  },
]

export const Template: VariantsStory<typeof SubscriptionThematicButton> = {
  name: 'SubscriptionThematicButton',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={SubscriptionThematicButton}
      defaultProps={{ ...props }}
    />
  ),
}
