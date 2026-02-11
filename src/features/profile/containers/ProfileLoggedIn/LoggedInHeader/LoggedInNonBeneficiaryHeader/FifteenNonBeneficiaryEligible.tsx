import React from 'react'

import { EmptyCredit } from 'features/profile/components/EmptyCredit/EmptyCredit'
import { ContainerHeader } from 'features/profile/components/Header/Container/ContainerHeader'
import { getProfileHeaderTitle } from 'features/profile/helpers/getProfileHeaderTitle'
import { ProfileFeatureFlagsProps } from 'features/profile/types'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { getAge } from 'shared/user/getAge'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

type Props = { user: UserProfileResponseWithoutSurvey } & ProfileFeatureFlagsProps

export const FifteenNonBeneficiaryEligible = ({ featureFlags, user }: Props) => {
  const { firstName, lastName, birthDate, eligibility } = user
  const title = getProfileHeaderTitle({ firstName, lastName })
  const age = getAge(birthDate) ?? 15

  return (
    <ViewGap gap={6} testID="fifteen-non-beneficiary-eligible-header">
      <PageHeader title={title} featureFlags={featureFlags} />
      <ContainerHeader>
        <EmptyCredit age={age} eligibility={eligibility} />
      </ContainerHeader>
    </ViewGap>
  )
}
