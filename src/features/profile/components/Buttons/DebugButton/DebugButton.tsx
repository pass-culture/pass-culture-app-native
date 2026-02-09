import React from 'react'

import { getProfilePropConfig } from 'features/navigation/navigators/ProfileStackNavigator/getProfilePropConfig'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'

export const DebugButton = () => (
  <InternalTouchableLink
    as={ButtonQuaternaryBlack}
    wording="Débuggage"
    navigateTo={getProfilePropConfig('DebugScreen')}
    justifyContent="flex-start"
    inline
  />
)
