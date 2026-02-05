import React from 'react'

import { LoggedInBeneficiaryContent } from 'features/profile/containers/ProfileLoggedIn/LoggedInContent/LoggedInBeneficiaryContent/LoggedInBeneficiaryContent'
import { LoggedInNonBeneficiaryContent } from 'features/profile/containers/ProfileLoggedIn/LoggedInContent/LoggedInNonBeneficiaryContent/LoggedInNonBeneficiaryContent'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'

type Props = { user: UserProfileResponseWithoutSurvey | undefined }

export const LoggedInContent = ({ user }: Props) => {
  return user?.isBeneficiary ? (
    <LoggedInBeneficiaryContent />
  ) : (
    <LoggedInNonBeneficiaryContent user={user} />
  )
}
