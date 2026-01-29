import React from 'react'

import { LoggedInBeneficiaryContent } from 'features/profile/components/Contents/LoggedInContent/LoggedInBeneficiaryContent'
import { LoggedInNonBeneficiaryContent } from 'features/profile/components/Contents/LoggedInContent/LoggedInNonBeneficiaryContent'

export const LoggedInContent = (user) => {
  return user?.isBeneficiary ? (
    <LoggedInBeneficiaryContent user={user} />
  ) : (
    <LoggedInNonBeneficiaryContent user={user} />
  )
}
