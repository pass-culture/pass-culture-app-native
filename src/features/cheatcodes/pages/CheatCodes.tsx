import { BatchUser } from '@bam.tech/react-native-batch'
import { t } from '@lingui/macro'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { Text, Alert } from 'react-native'
import styled from 'styled-components/native'

import { CodePushButton } from 'features/cheatcodes/components/CodePushButton'
import { CrashTestButton } from 'features/cheatcodes/components/CrashTestButton'
import { LogoutButton } from 'features/cheatcodes/components/LogoutButton'
import { NavigateHomeButton } from 'features/cheatcodes/components/NavigateHomeButton/NavigateHomeButton'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { _ } from 'libs/i18n'
import { Spacer } from 'ui/theme'

type CheatCodesNavigationProp = StackNavigationProp<RootStackParamList, 'CheatCodes'>

type Props = {
  navigation: CheatCodesNavigationProp
}

export const CheatCodes: FunctionComponent<Props> = function () {
  const [batchInstallationId, setBatchInstallationId] = useState('none')
  useEffect(() => {
    getBatchInstallationID().then(setBatchInstallationId)
  }, [])

  return (
    <Container>
      <Spacer.TopScreen />
      <Spacer.Flex />
      <CrashTestButton />
      <NavigateHomeButton />
      <LogoutButton />
      <Spacer.Flex />
      <Text>{batchInstallationId}</Text>
      <Spacer.Flex />
      <Spacer.Flex />
      {env.FEATURE_FLAG_CODE_PUSH_MANUAL && <CodePushButton />}

      <Spacer.BottomScreen />
    </Container>
  )
}

async function getBatchInstallationID() {
  try {
    return await BatchUser.getInstallationID()
  } catch (e) {
    Alert.alert(
      'Batch error',
      _(
        /*i18n: Error message on Batch get installation ID*/ t`An error has occured while obtaining the Batch installation ID : ${e}`
      )
    )
    return 'Batch error'
  }
}

const Container = styled.View({
  flex: 1,
  alignItems: 'center',
})
