import React from 'react'

import { getProfilePropConfig } from 'features/navigation/navigators/ProfileStackNavigator/getProfilePropConfig'
import { StyledSectionRow } from 'features/profile/components/SectionRowWithPaddingVertical/SectionRowWithPaddingVertical'
import { Bulb } from 'ui/svg/icons/Bulb'

type Props = { displayInAppFeedback: boolean }

export const FeedbackInAppButton = ({ displayInAppFeedback }: Props) => {
  return displayInAppFeedback ? (
    <StyledSectionRow
      title="Faire une suggestion"
      type="navigable"
      icon={Bulb}
      navigateTo={getProfilePropConfig('FeedbackInApp')}
    />
  ) : null
}
