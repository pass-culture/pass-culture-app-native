import React from 'react'

import { LoggedInBeneficiaryHeader } from 'features/profile/containers/ProfileLoggedIn/LoggedInHeader/LoggedInBeneficiaryHeader/LoggedInBeneficiaryHeader'
import { LoggedInNonBeneficiaryHeader } from 'features/profile/containers/ProfileLoggedIn/LoggedInHeader/LoggedInNonBeneficiaryHeader/LoggedInNonBeneficiaryHeader'
import { ProfileFeatureFlagsProps } from 'features/profile/types'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'

type Props = { user: UserProfileResponseWithoutSurvey } & ProfileFeatureFlagsProps

export const LoggedInHeader = ({ user, featureFlags }: Props) => {
  const commonProps = { user, featureFlags }

  return user.isBeneficiary ? (
    <LoggedInBeneficiaryHeader {...commonProps} />
  ) : (
    <LoggedInNonBeneficiaryHeader {...commonProps} />
  )
}
