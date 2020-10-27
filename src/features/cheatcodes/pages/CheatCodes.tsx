import { BatchUser } from '@bam.tech/react-native-batch'
import { t } from '@lingui/macro'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { View, Text, Alert } from 'react-native'

import { RootStackParamList } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { _ } from 'libs/i18n'

import { CodePushButton } from '../components/CodePushButton'
import { CrashTestButton } from '../components/CrashTestButton'

type CheatCodesNavigationProp = StackNavigationProp<RootStackParamList, 'CheatCodes'>

type Props = {
  navigation: CheatCodesNavigationProp
}

export const CheatCodes: FunctionComponent<Props> = function () {
  const getBatchInstallationID = useCallback(async (callback: (installationId: string) => void) => {
    try {
      const installationId = await BatchUser.getInstallationID()
      callback(installationId)
    } catch (e) {
      Alert.alert(
        'Batch error',
        _(
          /*i18n: Error message on Batch get installation ID*/ t`An error has occured while obtaining the Batch installation ID : ${e}`
        )
      )
      callback('Batch error')
    }
  }, [])
  const [batchInstallationId, setBatchInstallationId] = useState('none')
  useEffect(() => {
    getBatchInstallationID(setBatchInstallationId)
  }, [])
  return (
    <View>
      <CrashTestButton />
      <Text>{batchInstallationId}</Text>
      {env.FEATURE_FLAG_CODE_PUSH_MANUAL && <CodePushButton />}
    </View>
  )
}
