import React from 'react'

import { useBonificationBannerVisibility } from 'features/bonification/hooks/useBonificationBannerVisibility'
import { useGetStepperInfoQuery } from 'features/identityCheck/queries/useGetStepperInfoQuery'
import { LoggedInBeneficiaryHeader } from 'features/profile/containers/ProfileLoggedIn/LoggedInHeader/LoggedInBeneficiaryHeader/LoggedInBeneficiaryHeader'
import { LoggedInEligibleAndBeneficiaryHeader } from 'features/profile/containers/ProfileLoggedIn/LoggedInHeader/LoggedInEligibleAndBeneficiaryHeader/LoggedInEligibleAndBeneficiaryHeader'
import { LoggedInEligibleHeader } from 'features/profile/containers/ProfileLoggedIn/LoggedInHeader/LoggedInEligibleHeader/LoggedInEligibleHeader'
import { LoggedInExBeneficiaryHeader } from 'features/profile/containers/ProfileLoggedIn/LoggedInHeader/LoggedInExBeneficiaryHeader/LoggedInExBeneficiaryHeader'
import { LoggedInGeneralPublicHeader } from 'features/profile/containers/ProfileLoggedIn/LoggedInHeader/LoggedInGeneralPublicHeader/LoggedInGeneralPublicHeader'
import { ProfileFeatureFlagsProps } from 'features/profile/types'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'

type Props = { user: UserProfileResponseWithoutSurvey } & ProfileFeatureFlagsProps

export const LoggedInHeader = ({ user, featureFlags }: Props) => {
  const { data: remoteConfigData } = useRemoteConfigQuery()
  const enableBonification = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_BONIFICATION)
  const { hasClosedBonificationBanner, onCloseBanner } = useBonificationBannerVisibility()
  const bonificationInfos = { enableBonification, onCloseBanner, hasClosedBonificationBanner }
  const { data: subscriptionInfos } = useGetStepperInfoQuery()
  const depositAmount = useDepositAmountsByAge()

  const commonProps = { user, featureFlags }

  switch (user.statusType) {
    case 'ELIGIBLE':
      return <LoggedInEligibleHeader {...commonProps} subscriptionInfos={subscriptionInfos} />

    case 'ELIGIBLE_AND_BENEFICIARY':
      return <LoggedInEligibleAndBeneficiaryHeader {...commonProps} depositAmount={depositAmount} />

    case 'BENEFICIARY':
      return <LoggedInBeneficiaryHeader {...commonProps} bonificationInfos={bonificationInfos} />

    case 'EX_BENEFICIARY':
      return <LoggedInExBeneficiaryHeader {...commonProps} remoteConfigData={remoteConfigData} />

    case 'GENERAL_PUBLIC':
    default:
      return <LoggedInGeneralPublicHeader {...commonProps} />
  }
}
