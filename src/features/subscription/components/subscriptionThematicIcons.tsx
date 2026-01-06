import React from 'react'

import { SubscriptionThematicIllustration } from 'features/subscription/components/SubscriptionThematicIllustration'
import { SubscriptionTheme } from 'features/subscription/types'

const createThematicIcon = (thematic: SubscriptionTheme): React.FC => {
  const IconComponent: React.FC = () => (
    <SubscriptionThematicIllustration thematic={thematic} size="small" />
  )

  IconComponent.displayName = `SubscriptionThematicIcon(${thematic})`
  return IconComponent
}

export const SUBSCRIPTION_THEMATIC_ICONS: Record<SubscriptionTheme, React.FC> = {
  [SubscriptionTheme.CINEMA]: createThematicIcon(SubscriptionTheme.CINEMA),
  [SubscriptionTheme.LECTURE]: createThematicIcon(SubscriptionTheme.LECTURE),
  [SubscriptionTheme.MUSIQUE]: createThematicIcon(SubscriptionTheme.MUSIQUE),
  [SubscriptionTheme.SPECTACLES]: createThematicIcon(SubscriptionTheme.SPECTACLES),
  [SubscriptionTheme.ACTIVITES]: createThematicIcon(SubscriptionTheme.ACTIVITES),
  [SubscriptionTheme.VISITES]: createThematicIcon(SubscriptionTheme.VISITES),
}
