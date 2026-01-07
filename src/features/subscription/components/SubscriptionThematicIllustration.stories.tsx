import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import styled from 'styled-components/native'

import { SubscriptionTheme } from 'features/subscription/types'

import { SubscriptionThematicIllustration } from './SubscriptionThematicIllustration'

const meta: Meta<typeof SubscriptionThematicIllustration> = {
  title: 'Features/subscription/SubscriptionThematicIllustration',
  component: SubscriptionThematicIllustration,
}
export default meta

type Story = StoryObj<typeof SubscriptionThematicIllustration>

export const Default: Story = {
  render: () => (
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
  ),
  name: 'SubscriptionThematicIllustration',
}

const ThematicContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.designSystem.size.spacing.s,
  marginVertical: theme.designSystem.size.spacing.s,
}))
