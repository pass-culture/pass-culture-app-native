import React from 'react'

import { LoggedInBeneficiaryHeader } from 'features/profile/containers/ProfileLoggedIn/LoggedInHeader/LoggedInBeneficiaryHeader/LoggedInBeneficiaryHeader'
import { LoggedInEligibleHeader } from 'features/profile/containers/ProfileLoggedIn/LoggedInHeader/LoggedInEligibleHeader/LoggedInEligibleHeader'
import { LoggedInExBeneficiaryHeader } from 'features/profile/containers/ProfileLoggedIn/LoggedInHeader/LoggedInExBeneficiaryHeader/LoggedInExBeneficiaryHeader'
import { LoggedInGeneralPublicHeader } from 'features/profile/containers/ProfileLoggedIn/LoggedInHeader/LoggedInGeneralPublicHeader/LoggedInGeneralPublicHeader'
import { ProfileFeatureFlagsProps } from 'features/profile/types'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'

type Props = { user: UserProfileResponseWithoutSurvey } & ProfileFeatureFlagsProps

export const LoggedInHeader = ({ user, featureFlags }: Props) => {
  const commonProps = { user, featureFlags }

  switch (user.statusType) {
    case 'ELIGIBLE':
      return <LoggedInEligibleHeader {...commonProps} />

    case 'BENEFICIARY':
      return <LoggedInBeneficiaryHeader {...commonProps} />

    case 'EX_BENEFICIARY':
      return <LoggedInExBeneficiaryHeader {...commonProps} />

    case 'GENERAL_PUBLIC':
    default:
      return <LoggedInGeneralPublicHeader {...commonProps} />
  }
}
