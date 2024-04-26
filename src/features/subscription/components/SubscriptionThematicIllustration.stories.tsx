import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { SubscriptionTheme } from 'features/subscription/types'
import { Spacer } from 'ui/theme'

import { SubscriptionThematicIllustration } from './SubscriptionThematicIllustration'

const meta: ComponentMeta<typeof SubscriptionThematicIllustration> = {
  title: 'Features/subscription/SubscriptionThematicIllustration',
  component: SubscriptionThematicIllustration,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const Template: ComponentStory<typeof SubscriptionThematicIllustration> = () => (
  <React.Fragment>
    <SubscriptionThematicIllustration thematic={SubscriptionTheme.CINEMA} />
    <Spacer.Column numberOfSpaces={4} />
    <SubscriptionThematicIllustration thematic={SubscriptionTheme.LECTURE} />
    <Spacer.Column numberOfSpaces={4} />
    <SubscriptionThematicIllustration thematic={SubscriptionTheme.MUSIQUE} />
    <Spacer.Column numberOfSpaces={4} />
    <SubscriptionThematicIllustration thematic={SubscriptionTheme.SPECTACLES} />
    <Spacer.Column numberOfSpaces={4} />
    <SubscriptionThematicIllustration thematic={SubscriptionTheme.VISITES} />
    <Spacer.Column numberOfSpaces={4} />
    <SubscriptionThematicIllustration thematic={SubscriptionTheme.ACTIVITES} />
  </React.Fragment>
)

export const Default = Template.bind({})
