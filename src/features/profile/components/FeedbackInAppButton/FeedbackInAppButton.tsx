import React from 'react'

import { getProfilePropConfig } from 'features/navigation/ProfileStackNavigator/getProfilePropConfig'
import { StyledSectionRow } from 'features/profile/components/SectionRowWithPaddingVertical/SectionRowWithPaddingVertical'
import { Bulb } from 'ui/svg/icons/Bulb'

export const FeedbackInAppButton = () => {
  return (
    <StyledSectionRow
      title="Faire une suggestion"
      type="navigable"
      icon={Bulb}
      navigateTo={getProfilePropConfig('FeedbackInApp')}
    />
  )
}
