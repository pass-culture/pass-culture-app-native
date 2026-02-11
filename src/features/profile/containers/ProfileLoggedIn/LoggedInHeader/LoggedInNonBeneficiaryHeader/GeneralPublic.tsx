import React from 'react'
import { View } from 'react-native'

import { getProfileHeaderTitle } from 'features/profile/helpers/getProfileHeaderTitle'
import { ProfileFeatureFlagsProps } from 'features/profile/types'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { PageHeader } from 'ui/components/headers/PageHeader'

type Props = { user: UserProfileResponseWithoutSurvey } & ProfileFeatureFlagsProps

export const GeneralPublic = ({ user, featureFlags }: Props) => {
  const { firstName, lastName } = user
  const title = getProfileHeaderTitle({ firstName, lastName })

  return (
    <View testID="general-public-header">
      <PageHeader title={title} featureFlags={featureFlags} />
    </View>
  )
}
