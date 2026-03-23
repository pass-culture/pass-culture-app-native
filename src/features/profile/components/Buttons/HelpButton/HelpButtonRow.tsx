import React from 'react'

import { getProfilePropConfig } from 'features/navigation/ProfileStackNavigator/getProfilePropConfig'
import { StyledSectionRow } from 'features/profile/components/SectionRowWithPaddingVertical/SectionRowWithPaddingVertical'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { analytics } from 'libs/analytics/provider'
import { getAge } from 'shared/user/getAge'
import { LifeBuoy } from 'ui/svg/icons/LifeBuoy'

type Props = { birthDate: UserProfileResponseWithoutSurvey['birthDate'] | undefined }

export const HelpButtonRow = ({ birthDate }: Props) => (
  <StyledSectionRow
    key="HelpButton"
    title="Comment ça marche&nbsp;?"
    type="navigable"
    icon={LifeBuoy}
    navigateTo={getProfilePropConfig('ProfileTutorialAgeInformationCredit')}
    onPress={() => analytics.logConsultTutorial({ age: getAge(birthDate), from: 'ProfileHelp' })}
  />
)
