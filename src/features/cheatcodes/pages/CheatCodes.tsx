import { BatchUser } from '@bam.tech/react-native-batch'
import { t } from '@lingui/macro'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { Text, Alert } from 'react-native'
import styled from 'styled-components/native'

import { RootStackParamList } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { _ } from 'libs/i18n'

import { Spacer } from '../../../ui/theme'
import { CodePushButton } from '../components/CodePushButton'
import { CrashTestButton } from '../components/CrashTestButton'
import { NavigateHomeButton } from '../components/NavigateHomeButton/NavigateHomeButton'

type CheatCodesNavigationProp = StackNavigationProp<RootStackParamList, 'CheatCodes'>

type Props = {
  navigation: CheatCodesNavigationProp
}

const Container = styled.View({
  flex: 1,
})

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
    <Container>
      <CrashTestButton />
      <NavigateHomeButton />
      <Text>{batchInstallationId}</Text>
      <Spacer.Flex />
      {env.FEATURE_FLAG_CODE_PUSH_MANUAL && <CodePushButton />}
    </Container>
  )
}
