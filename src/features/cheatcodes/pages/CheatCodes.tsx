import { BatchUser } from '@bam.tech/react-native-batch'
import { t } from '@lingui/macro'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { Text, Alert, Button } from 'react-native'
import styled from 'styled-components/native'

import { CodePushButton } from 'features/cheatcodes/components/CodePushButton'
import { CrashTestButton } from 'features/cheatcodes/components/CrashTestButton'
import { IdCheckButton } from 'features/cheatcodes/components/IdCheckButton'
import { NavigateHomeButton } from 'features/cheatcodes/components/NavigateHomeButton/NavigateHomeButton'
import { HomeStackParamList } from 'features/home/navigation/HomeNavigator'
import { env } from 'libs/environment'
import { _ } from 'libs/i18n'
import { SafeContainer } from 'ui/components/SafeContainer'
import { Spacer } from 'ui/theme'

type CheatCodesNavigationProp = StackNavigationProp<HomeStackParamList, 'CheatCodes'>

type Props = {
  navigation: CheatCodesNavigationProp
}

export const CheatCodes: FunctionComponent<Props> = function ({ navigation }) {
  const [batchInstallationId, setBatchInstallationId] = useState('none')

  useEffect(() => {
    getBatchInstallationID().then(setBatchInstallationId)
  }, [])

  return (
    <SafeContainer>
      <Container>
        <CrashTestButton />
        <NavigateHomeButton />
        <IdCheckButton />
        <Button
          title={'Reset password email sent'}
          onPress={() =>
            // TODO => PC-4356
            navigation.navigate('ResetPasswordEmailSent', { userEmail: 'jean.dupont@gmail.com' })
          }
        />
        <Text>{batchInstallationId}</Text>
        <Spacer.Flex />
        {env.FEATURE_FLAG_CODE_PUSH_MANUAL && <CodePushButton />}
      </Container>
    </SafeContainer>
  )
}

async function getBatchInstallationID() {
  try {
    return BatchUser.getInstallationID()
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
})
