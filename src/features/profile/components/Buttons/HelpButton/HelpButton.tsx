import React from 'react'

import { getProfilePropConfig } from 'features/navigation/navigators/ProfileStackNavigator/getProfilePropConfig'
import { StyledSectionRow } from 'features/profile/components/SectionRowWithPaddingVertical/SectionRowWithPaddingVertical'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { analytics } from 'libs/analytics/provider'
import { getAge } from 'shared/user/getAge'
import { LifeBuoy } from 'ui/svg/icons/LifeBuoy'

type Props = { user: UserProfileResponseWithoutSurvey | undefined }

export const HelpButton = ({ user }: Props) => (
  <StyledSectionRow
    key="HelpButton"
    title="Comment ça marche&nbsp;?"
    type="navigable"
    icon={LifeBuoy}
    navigateTo={getProfilePropConfig('ProfileTutorialAgeInformationCredit')}
    onPress={() =>
      analytics.logConsultTutorial({ age: getAge(user?.birthDate), from: 'ProfileHelp' })
    }
  />
)
