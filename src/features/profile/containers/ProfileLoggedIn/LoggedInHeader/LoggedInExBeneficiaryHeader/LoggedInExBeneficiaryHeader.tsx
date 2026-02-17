import React from 'react'
import { View } from 'react-native'

import { getProfileHeaderTitle } from 'features/profile/helpers/getProfileHeaderTitle'
import { ProfileFeatureFlagsProps } from 'features/profile/types'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { PageHeader } from 'ui/components/headers/PageHeader'

type Props = { user: UserProfileResponseWithoutSurvey } & ProfileFeatureFlagsProps

export const LoggedInExBeneficiaryHeader = ({ user, featureFlags }: Props) => {
  const { firstName, lastName } = user
  const headerTitle = getProfileHeaderTitle({ firstName, lastName })

  return (
    <View testID="logged-in-ex-beneficiary-header">
      <PageHeader title={headerTitle} featureFlags={featureFlags} />
    </View>
  )
}
