import React from 'react'

import { EligibleFreeBanner } from 'features/home/components/EligibleFreeBanner'
import { EmptyCredit } from 'features/profile/components/EmptyCredit/EmptyCredit'
import { ContainerHeader } from 'features/profile/components/Header/Container/ContainerHeader'
import { getProfileHeaderTitle } from 'features/profile/helpers/getProfileHeaderTitle'
import { getShouldShowEligibleFreeBanner } from 'features/share/helpers/getShouldShowFreeBanner'
import { UserProfile } from 'features/share/types'
import { getAge } from 'shared/user/getAge'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

type Props = {
  user: UserProfile
  defaultAge: 15 | 16
}

export const EligibleFreeHeader = ({ user, defaultAge }: Props) => {
  const { firstName, lastName, birthDate, eligibilityType } = user
  const title = getProfileHeaderTitle({ firstName, lastName })
  const age = getAge(birthDate) ?? defaultAge
  const showEligibleFreeBanner = getShouldShowEligibleFreeBanner(
    user?.eligibilityType,
    user?.subscriptionStatus
  )
  return (
    <ViewGap gap={6} testID="eligible-free-header">
      <PageHeader title={title} numberOfLines={3} />
      {showEligibleFreeBanner ? (
        <EligibleFreeBanner />
      ) : (
        <ContainerHeader gap={0}>
          <EmptyCredit age={age} eligibilityType={eligibilityType} />
        </ContainerHeader>
      )}
    </ViewGap>
  )
}
