import React from 'react'
import { View } from 'react-native'

import { Typo } from 'ui/theme'

export function TemporaryProfilePage() {
  return (
    <View>
      {/* eslint-disable-next-line react-native/no-raw-text */}
      <Typo.Title1>{'Page temporaire'}</Typo.Title1>
    </View>
  )
}
