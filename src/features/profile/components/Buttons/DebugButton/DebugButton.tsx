import React from 'react'

import { getProfilePropConfig } from 'features/navigation/ProfileStackNavigator/getProfilePropConfig'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Button } from 'ui/designSystem/Button/Button'

export const DebugButton = () => (
  <InternalTouchableLink
    as={Button}
    variant="tertiary"
    color="neutral"
    wording="Débuggage"
    navigateTo={getProfilePropConfig('DebugScreen')}
    justifyContent="flex-start"
    inline
  />
)
