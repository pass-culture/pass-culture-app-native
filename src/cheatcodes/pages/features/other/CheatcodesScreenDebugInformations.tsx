import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { Alert, Button, Text } from 'react-native'

import { api } from 'api/api'
import { CodePushButton } from 'cheatcodes/components/CodePushButton'
import { CrashTestButton } from 'cheatcodes/components/CrashTestButton'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { env } from 'libs/environment'
import { decodeToken } from 'libs/jwt/jwt'
import { clearRefreshToken } from 'libs/keychain/keychain'
import { highlightLinks } from 'libs/parsers/highlightLinks'
import { BatchUser } from 'libs/react-native-batch'
import { storage } from 'libs/storage'
import { getErrorMessage } from 'shared/getErrorMessage/getErrorMessage'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { Spacer, Typo } from 'ui/theme'

type CheatCodesNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CheatcodesScreenDebugInformations'
>

type Props = {
  navigation: CheatCodesNavigationProp
}

const oldAccesstoken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDc1OTE1MzUsIm5iZiI6MTYwNzU5MTUzNSwianRpIjoiNjM' +
  'xNzU4MGItYjU0ZS00YzdhLWExZTAtYWJlNjdkMTI5NTljIiwiZXhwIjoxNjA3NTkxNTk1LCJpZGVudGl0eSI6InBjdGVzd' +
  'C5qZXVuZTkzLmhhcy1ib29rZWQtc29tZUBidG14LmZyIiwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.hvQDl6h' +
  '_RCkrxrsWIlAFqszwE9AN3Q_SV1W_mAu_fS0'

const someOfferDescription = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. https://www.google.com/search?q=pass+culture&oq=pass+culture&aqs=chrome.0.0i433j0l2j69i60l3j69i65l2.1136j0j7&sourceid=chrome&ie=UTF-8 Amet justo donec enim diam vulputate.`

const getUserId = async () => {
  const accessToken = await storage.readString('access_token')
  if (!accessToken) {
    return null
  }
  const tokenContent = decodeToken(accessToken)
  return tokenContent?.user_claims?.user_id ?? null
}

export const CheatcodesScreenDebugInformations: FunctionComponent<Props> = function () {
  const [batchInstallationId, setBatchInstallationId] = useState('none')
  const [userEmail, setUserEmail] = useState('')
  const [userId, setUserId] = useState<null | number>(null)

  useEffect(() => {
    getBatchInstallationID().then(setBatchInstallationId)
  }, [])

  useEffect(() => {
    getUserId().then(setUserId)
  }, [])

  const ParsedDescription = highlightLinks(someOfferDescription)

  async function fetchMe() {
    try {
      const response = await api.getNativeV1Me()
      setUserEmail(response.email)
    } catch {
      //
    }
  }

  async function setOldToken() {
    await storage.saveString('access_token', oldAccesstoken)
  }

  async function invalidateBothTokens() {
    await storage.clear('access_token')
    await clearRefreshToken()
  }

  return (
    <SecondaryPageWithBlurHeader title="CheatCodes">
      <CrashTestButton />
      <Spacer.Flex />
      <Button title="Utiliser un ancien token" onPress={setOldToken} />
      <Button title="Invalider l’access token" onPress={setOldToken} />
      <Button title="Invalider les 2 tokens" onPress={invalidateBothTokens} />
      <Button title="/ME" onPress={fetchMe} />
      <Text>{userEmail}</Text>
      <Spacer.Flex />
      <Text>Batch installation ID: {batchInstallationId}</Text>
      <Text>User ID: {userId}</Text>
      <Spacer.Flex />
      <Typo.Body>{someOfferDescription}</Typo.Body>
      <Spacer.Flex />
      <Typo.Body>{ParsedDescription}</Typo.Body>
      <Spacer.Flex />
      {env.ENV === 'testing' ? <CodePushButton /> : null}
    </SecondaryPageWithBlurHeader>
  )
}

async function getBatchInstallationID() {
  try {
    return await BatchUser.getInstallationID()
  } catch (error) {
    const errorMessage = getErrorMessage(error)

    Alert.alert(
      'Batch error',
      `An error has occured while obtaining the Batch installation ID: ${errorMessage}`
    )
    return 'Batch error'
  }
}
