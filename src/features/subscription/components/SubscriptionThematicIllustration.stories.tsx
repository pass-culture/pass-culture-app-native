import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { SubscriptionTheme } from 'features/subscription/types'
import { getSpacing } from 'ui/theme'

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
    <ThematicContainer>
      <SubscriptionThematicIllustration thematic={SubscriptionTheme.CINEMA} />
      <SubscriptionThematicIllustration thematic={SubscriptionTheme.CINEMA} size="M" />
    </ThematicContainer>
    <ThematicContainer>
      <SubscriptionThematicIllustration thematic={SubscriptionTheme.LECTURE} />
      <SubscriptionThematicIllustration thematic={SubscriptionTheme.LECTURE} size="M" />
    </ThematicContainer>
    <ThematicContainer>
      <SubscriptionThematicIllustration thematic={SubscriptionTheme.MUSIQUE} />
      <SubscriptionThematicIllustration thematic={SubscriptionTheme.MUSIQUE} size="M" />
    </ThematicContainer>
    <ThematicContainer>
      <SubscriptionThematicIllustration thematic={SubscriptionTheme.SPECTACLES} />
      <SubscriptionThematicIllustration thematic={SubscriptionTheme.SPECTACLES} size="M" />
    </ThematicContainer>
    <ThematicContainer>
      <SubscriptionThematicIllustration thematic={SubscriptionTheme.VISITES} />
      <SubscriptionThematicIllustration thematic={SubscriptionTheme.VISITES} size="M" />
    </ThematicContainer>
    <ThematicContainer>
      <SubscriptionThematicIllustration thematic={SubscriptionTheme.ACTIVITES} />
      <SubscriptionThematicIllustration thematic={SubscriptionTheme.ACTIVITES} size="M" />
    </ThematicContainer>
  </React.Fragment>
)

export const Default = Template.bind({})

const ThematicContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  gap: getSpacing(2),
  marginVertical: getSpacing(2),
})
