import React from 'react'

import { ExBeneficiaryBanner } from 'features/profile/components/Banners/ExBeneficiaryBanner/ExBeneficiaryBanner'
import { Subtitle } from 'features/profile/components/Subtitle/Subtitle'
import { getHeaderSubtitleProps } from 'features/profile/helpers/getHeaderSubtitleProps'
import { getIsDepositExpired } from 'features/profile/helpers/getIsDepositExpired'
import { getProfileHeaderTitle } from 'features/profile/helpers/getProfileHeaderTitle'
import { ProfileFeatureFlagsProps } from 'features/profile/types'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

type Props = {
  user: UserProfileResponseWithoutSurvey
  remoteConfigData: { homeEntryIdFreeOffers: string }
} & ProfileFeatureFlagsProps

export const LoggedInExBeneficiaryHeader = ({ user, featureFlags, remoteConfigData }: Props) => {
  const { firstName, lastName, domainsCredit, depositExpirationDate, eligibility } = user
  const headerTitle = getProfileHeaderTitle({ firstName, lastName })
  const isCreditEmpty = domainsCredit?.all.remaining === 0
  const isDepositExpired = getIsDepositExpired({ depositExpirationDate })
  const subtitleProps = getHeaderSubtitleProps({
    isCreditEmpty,
    isDepositExpired,
    depositExpirationDate,
    eligibility,
  })

  return (
    <ViewGap gap={6} testID="logged-in-ex-beneficiary-header">
      <ViewGap gap={2}>
        <PageHeader title={headerTitle} featureFlags={featureFlags} numberOfLines={3} />
        <Subtitle {...subtitleProps} />
      </ViewGap>
      <ExBeneficiaryBanner remoteConfigData={remoteConfigData} />
    </ViewGap>
  )
}
