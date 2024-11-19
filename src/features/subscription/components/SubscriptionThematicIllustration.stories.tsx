import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta, ComponentStory } from '@storybook/react'
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
      <SubscriptionThematicIllustration thematic={SubscriptionTheme.CINEMA} size="small" />
    </ThematicContainer>
    <ThematicContainer>
      <SubscriptionThematicIllustration thematic={SubscriptionTheme.LECTURE} />
      <SubscriptionThematicIllustration thematic={SubscriptionTheme.LECTURE} size="small" />
    </ThematicContainer>
    <ThematicContainer>
      <SubscriptionThematicIllustration thematic={SubscriptionTheme.MUSIQUE} />
      <SubscriptionThematicIllustration thematic={SubscriptionTheme.MUSIQUE} size="small" />
    </ThematicContainer>
    <ThematicContainer>
      <SubscriptionThematicIllustration thematic={SubscriptionTheme.SPECTACLES} />
      <SubscriptionThematicIllustration thematic={SubscriptionTheme.SPECTACLES} size="small" />
    </ThematicContainer>
    <ThematicContainer>
      <SubscriptionThematicIllustration thematic={SubscriptionTheme.VISITES} />
      <SubscriptionThematicIllustration thematic={SubscriptionTheme.VISITES} size="small" />
    </ThematicContainer>
    <ThematicContainer>
      <SubscriptionThematicIllustration thematic={SubscriptionTheme.ACTIVITES} />
      <SubscriptionThematicIllustration thematic={SubscriptionTheme.ACTIVITES} size="small" />
    </ThematicContainer>
  </React.Fragment>
)

export const Default = Template.bind({})
Default.storyName = 'SubscriptionThematicIllustration'

const ThematicContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  gap: getSpacing(2),
  marginVertical: getSpacing(2),
})
