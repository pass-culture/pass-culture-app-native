import React from 'react'

import { SubscriptionThematicIllustration } from 'features/subscription/components/SubscriptionThematicIllustration'
import { mapSubscriptionThemeToName } from 'features/subscription/helpers/mapSubscriptionThemeToName'
import { SubscriptionTheme } from 'features/subscription/types'
import { accessibleRadioProps } from 'shared/accessibilityProps/accessibleRadioProps'
import { IllustratedRadioSelector } from 'ui/components/radioSelector/IllustratedRadioSelector'

interface Props {
  thematic: SubscriptionTheme
  checked: boolean
  onPress: () => void
}

export const SubscriptionThematicButton = ({ thematic, checked, onPress }: Props) => {
  return (
    <IllustratedRadioSelector
      {...accessibleRadioProps({ label: mapSubscriptionThemeToName[thematic], checked })}
      label={mapSubscriptionThemeToName[thematic]}
      onPress={onPress}
      checked={checked}
      Illustration={() => <SubscriptionThematicIllustration thematic={thematic} />}
    />
  )
}
