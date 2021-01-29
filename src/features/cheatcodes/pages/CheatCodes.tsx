import { BatchUser } from '@bam.tech/react-native-batch'
import { t } from '@lingui/macro'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { Text, Alert, Button } from 'react-native'
import styled from 'styled-components/native'

import { api } from 'api/api'
import { LogoutButton } from 'features/auth/components/LogoutButton'
import { CodePushButton } from 'features/cheatcodes/components/CodePushButton'
import { CrashTestButton } from 'features/cheatcodes/components/CrashTestButton'
import { NavigateHomeButton } from 'features/cheatcodes/components/NavigateHomeButton/NavigateHomeButton'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { _ } from 'libs/i18n'
import { clearRefreshToken } from 'libs/keychain'
import { highlightLinks } from 'libs/parsers/highlightLinks'
import { saveAccessToken, clearAccessToken } from 'libs/storage'
import { getSpacing, Spacer, Typo } from 'ui/theme'

type CheatCodesNavigationProp = StackNavigationProp<RootStackParamList, 'CheatCodes'>

type Props = {
  navigation: CheatCodesNavigationProp
}

const oldAccesstoken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDc1OTE1MzUsIm5iZiI6MTYwNzU5MTUzNSwianRpIjoiNjM' +
  'xNzU4MGItYjU0ZS00YzdhLWExZTAtYWJlNjdkMTI5NTljIiwiZXhwIjoxNjA3NTkxNTk1LCJpZGVudGl0eSI6InBjdGVzd' +
  'C5qZXVuZTkzLmhhcy1ib29rZWQtc29tZUBidG14LmZyIiwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.hvQDl6h' +
  '_RCkrxrsWIlAFqszwE9AN3Q_SV1W_mAu_fS0'

const someOfferDescription = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. https://www.google.com/search?q=pass+culture&oq=pass+culture&aqs=chrome.0.0i433j0l2j69i60l3j69i65l2.1136j0j7&sourceid=chrome&ie=UTF-8 Amet justo donec enim diam vulputate.`

export const CheatCodes: FunctionComponent<Props> = function () {
  const [batchInstallationId, setBatchInstallationId] = useState('none')
  const [userEmail, setUserEmail] = useState('')
  useEffect(() => {
    getBatchInstallationID().then(setBatchInstallationId)
    BatchUser.editor().setIdentifier('alainn').save()
  }, [])
  const ParsedDescription = highlightLinks(someOfferDescription)

  async function fetchMe() {
    try {
      const response = await api.getnativev1me()
      setUserEmail(response.email)
    } catch {
      //
    }
  }

  async function setOldToken() {
    await saveAccessToken(oldAccesstoken)
  }

  async function invalidateBothTokens() {
    await clearAccessToken()
    await clearRefreshToken()
  }

  return (
    <Container>
      <Spacer.TopScreen />
      <Spacer.Flex />
      <CrashTestButton />
      <NavigateHomeButton />
      <LogoutButton />
      <Spacer.Flex />
      <Button title="Utiliser un ancien token" onPress={setOldToken} />
      <Button title="Invalider l'access token" onPress={setOldToken} />
      <Button title="Invalider les 2 tokens" onPress={invalidateBothTokens} />
      <Button title="/ME" onPress={fetchMe} />
      <Text>{userEmail}</Text>
      <Spacer.Flex />
      <Text>{batchInstallationId}</Text>
      <Spacer.Flex />
      <Typo.Body>{someOfferDescription}</Typo.Body>
      <Spacer.Flex />
      <Typo.Body>{ParsedDescription}</Typo.Body>
      <Spacer.Flex />
      {(env.FEATURE_FLAG_CODE_PUSH_MANUAL || env.ENV === 'testing') && <CodePushButton />}
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
  marginHorizontal: getSpacing(6),
})
