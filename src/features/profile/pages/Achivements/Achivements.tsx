import React, { FC } from 'react'
import { View } from 'react-native'

import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { TypoDS } from 'ui/theme'

export const Achivements = () => {
  return (
    <SecondaryPageWithBlurHeader title="Achivements">
      <Badge />
      <Badge isCompleted />
    </SecondaryPageWithBlurHeader>
  )
}

type BadgeProps = {
  isCompleted?: boolean
}

const Badge: FC<BadgeProps> = ({ isCompleted = false }) => {
  return (
    <View>
      <TypoDS.Body>Badge</TypoDS.Body>
    </View>
  )
}
