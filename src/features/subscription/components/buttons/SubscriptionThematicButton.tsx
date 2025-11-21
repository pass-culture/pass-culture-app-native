import React, { useCallback } from 'react'

import { SubscriptionThematicIllustration } from 'features/subscription/components/SubscriptionThematicIllustration'
import { mapSubscriptionThemeToName } from 'features/subscription/helpers/mapSubscriptionThemeToName'
import { SubscriptionTheme } from 'features/subscription/types'
import { Checkbox } from 'ui/designSystem/Checkbox/Checkbox'

interface Props {
  thematic: SubscriptionTheme
  checked: boolean
  onPress: () => void
}

export const SubscriptionThematicButton = ({ thematic, checked, onPress }: Props) => {
  const Icon = useCallback(
    () => <SubscriptionThematicIllustration thematic={thematic} size="small" />,
    [thematic]
  )

  return (
    <Checkbox
      isChecked={checked}
      label={mapSubscriptionThemeToName[thematic]}
      onPress={onPress}
      variant="detailed"
      asset={{ variant: 'icon', Icon }}
    />
  )
}
