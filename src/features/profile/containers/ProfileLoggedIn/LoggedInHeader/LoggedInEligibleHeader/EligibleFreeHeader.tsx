import React from 'react'

import { EmptyCredit } from 'features/profile/components/EmptyCredit/EmptyCredit'
import { ContainerHeader } from 'features/profile/components/Header/Container/ContainerHeader'
import { getProfileHeaderTitle } from 'features/profile/helpers/getProfileHeaderTitle'
import { ProfileFeatureFlagsProps } from 'features/profile/types'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { getAge } from 'shared/user/getAge'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'

type Props = {
  user: UserProfileResponseWithoutSurvey
  defaultAge: 15 | 16
} & ProfileFeatureFlagsProps

export const EligibleFreeHeader = ({ featureFlags, user, defaultAge }: Props) => {
  const { firstName, lastName, birthDate, eligibility } = user
  const title = getProfileHeaderTitle({ firstName, lastName })
  const age = getAge(birthDate) ?? defaultAge

  return (
    <ViewGap gap={6} testID="eligible-free-header">
      <PageHeader title={title} featureFlags={featureFlags} numberOfLines={3} />
      <ContainerHeader gap={0}>
        <EmptyCredit age={age} eligibility={eligibility} />
      </ContainerHeader>
    </ViewGap>
  )
}
