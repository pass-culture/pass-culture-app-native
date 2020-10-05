import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import { View } from 'react-native'

import { RootStackParamList } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'

import { CodePushButton } from '../components/CodePushButton'
import { CrashTestButton } from '../components/CrashTestButton'

type CheatCodesNavigationProp = StackNavigationProp<RootStackParamList, 'CheatCodes'>

type Props = {
  navigation: CheatCodesNavigationProp
}

export const CheatCodes: FunctionComponent<Props> = function () {
  return (
    <View>
      <CrashTestButton />
      {env.FEATURE_FLAG_CODE_PUSH && <CodePushButton />}
    </View>
  )
}
