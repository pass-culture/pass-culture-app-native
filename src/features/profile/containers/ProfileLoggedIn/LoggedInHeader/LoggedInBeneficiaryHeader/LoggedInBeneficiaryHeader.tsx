import React from 'react'

import { UserCreditType } from 'features/auth/helpers/getCreditType'
import { UserStatusType } from 'features/auth/helpers/getStatusType'
import { BonificationBanner } from 'features/bonification/components/BonificationBanner'
import { getShouldShowBonificationBanner } from 'features/bonification/getShouldShowBonificationBanner'
import { BeneficiaryEmptyHeader } from 'features/profile/containers/ProfileLoggedIn/LoggedInHeader/LoggedInBeneficiaryHeader/BeneficiaryEmptyHeader'
import { BeneficiaryFreeHeader } from 'features/profile/containers/ProfileLoggedIn/LoggedInHeader/LoggedInBeneficiaryHeader/BeneficiaryFreeHeader'
import { BeneficiaryHeader } from 'features/profile/containers/ProfileLoggedIn/LoggedInHeader/LoggedInBeneficiaryHeader/BeneficiaryHeader'
import { LoggedInGeneralPublicHeader } from 'features/profile/containers/ProfileLoggedIn/LoggedInHeader/LoggedInGeneralPublicHeader/LoggedInGeneralPublicHeader'
import { logHeaderFallback } from 'features/profile/helpers/logHeaderFallback'
import { ProfileFeatureFlagsProps } from 'features/profile/types'
import { UserProfile } from 'features/share/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

type Props = {
  user: UserProfile
  bonificationInfos: {
    enableBonification: boolean
    onCloseBanner: () => void
    hasClosedBonificationBanner: boolean
  }
} & ProfileFeatureFlagsProps

export const LoggedInBeneficiaryHeader = ({ user, featureFlags, bonificationInfos }: Props) => {
  const { creditType, qfBonificationStatus } = user
  const { enableBonification, hasClosedBonificationBanner, onCloseBanner } = bonificationInfos

  const showBonificationBanner = getShouldShowBonificationBanner({
    enableBonification,
    hasClosedBonificationBanner,
    qfBonificationStatus,
  })

  let header: React.ReactNode

  switch (creditType) {
    case UserCreditType.CREDIT_EMPTY:
      header = <BeneficiaryEmptyHeader user={user} />
      break

    case UserCreditType.CREDIT_V3_FREE:
      header = <BeneficiaryFreeHeader user={user} />
      break

    case UserCreditType.CREDIT_V1_18:
    case UserCreditType.CREDIT_V2_15:
    case UserCreditType.CREDIT_V2_16:
    case UserCreditType.CREDIT_V2_17:
    case UserCreditType.CREDIT_V2_18:
    case UserCreditType.CREDIT_V3_17:
    case UserCreditType.CREDIT_V3_18:
      header = <BeneficiaryHeader user={user} />
      break

    case UserCreditType.CREDIT_UNKNOWN:
    case UserCreditType.NO_CREDIT:
    default:
      logHeaderFallback({ headerType: UserStatusType.BENEFICIARY, user })
      header = <LoggedInGeneralPublicHeader featureFlags={featureFlags} user={user} />
  }

  return (
    <ViewGap gap={6} testID="logged-in-beneficiary-header">
      {header}
      {showBonificationBanner ? (
        <BonificationBanner
          bonificationStatus={qfBonificationStatus}
          onCloseCallback={onCloseBanner}
        />
      ) : null}
    </ViewGap>
  )
}
