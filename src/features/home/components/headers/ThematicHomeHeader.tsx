import React, { FunctionComponent } from 'react'
import { View } from 'react-native'

import { BackButton } from 'ui/components/headers/BackButton'
import { Spacer, Typo } from 'ui/theme'

export interface ThematicHomeHeaderProps {
  headerTitle: string
}
export const ThematicHomeHeader: FunctionComponent<ThematicHomeHeaderProps> = ({ headerTitle }) => {
  return (
    <View>
      <Spacer.TopScreen />
      <BackButton />
      <Spacer.Column numberOfSpaces={6} />
      <Typo.Title1 numberOfLines={1}>{headerTitle}</Typo.Title1>
    </View>
  )
}
