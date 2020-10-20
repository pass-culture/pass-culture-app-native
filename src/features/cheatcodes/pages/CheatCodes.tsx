import { BatchUser } from '@bam.tech/react-native-batch'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { View, Text, Alert } from 'react-native'

import { RootStackParamList } from 'features/navigation/RootNavigator'

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
      Alert.alert('error', e)
      callback('error')
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
    </View>
  )
}
