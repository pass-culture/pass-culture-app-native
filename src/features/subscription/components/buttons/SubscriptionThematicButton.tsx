import React from 'react'

import { SubscriptionThematicIllustration } from 'features/subscription/components/SubscriptionThematicIllustration'
import { mapSubscriptionThemeToName } from 'features/subscription/helpers/mapSubscriptionThemeToName'
import { SubscriptionTheme } from 'features/subscription/types'
import { CheckboxBlock } from 'ui/components/CheckboxBlock/CheckboxBlock'

interface Props {
  thematic: SubscriptionTheme
  checked: boolean
  onPress: () => void
}

export const SubscriptionThematicButton = ({ thematic, checked, onPress }: Props) => {
  return (
    <CheckboxBlock
      checked={checked}
      label={mapSubscriptionThemeToName[thematic]}
      onPress={onPress}
      LeftIcon={() => <SubscriptionThematicIllustration thematic={thematic} size="small" />}
    />
  )
}
