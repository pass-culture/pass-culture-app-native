import React from 'react'

import { getProfilePropConfig } from 'features/navigation/ProfileStackNavigator/getProfilePropConfig'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { analytics } from 'libs/analytics/provider'
import { getAge } from 'shared/user/getAge'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Button } from 'ui/designSystem/Button/Button'
import { ButtonContainerFlexStart } from 'ui/designSystem/Button/ButtonContainerFlexStart'
import { Question } from 'ui/svg/icons/Question'

type Props = { birthDate: UserProfileResponseWithoutSurvey['birthDate'] | undefined }

export const HelpButton = ({ birthDate }: Props) => (
  <ButtonContainerFlexStart>
    <InternalTouchableLink
      as={Button}
      variant="tertiary"
      color="neutral"
      icon={Question}
      numberOfLines={2}
      wording="Comment ça marche&nbsp;?"
      navigateTo={getProfilePropConfig('ProfileTutorialAgeInformationCredit')}
      onBeforeNavigate={() =>
        analytics.logConsultTutorial({ age: getAge(birthDate), from: 'CreditBlock' })
      }
    />
  </ButtonContainerFlexStart>
)
