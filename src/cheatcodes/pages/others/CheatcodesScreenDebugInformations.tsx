import { HotUpdater, getUpdateSource } from '@hot-updater/react-native'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { Alert, Button } from 'react-native'

import { api } from 'api/api'
import { CrashTestButton } from 'cheatcodes/components/CrashTestButton'
import { env } from 'libs/environment/env'
import { decodeToken } from 'libs/jwt/jwt'
import { clearRefreshToken } from 'libs/keychain/keychain'
import { BatchUser } from 'libs/react-native-batch'
import { storage } from 'libs/storage'
import { getErrorMessage } from 'shared/getErrorMessage/getErrorMessage'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { Typo } from 'ui/theme'

const oldAccesstoken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDc1OTE1MzUsIm5iZiI6MTYwNzU5MTUzNSwianRpIjoiNjM' +
  'xNzU4MGItYjU0ZS00YzdhLWExZTAtYWJlNjdkMTI5NTljIiwiZXhwIjoxNjA3NTkxNTk1LCJpZGVudGl0eSI6InBjdGVzd' +
  'C5qZXVuZTkzLmhhcy1ib29rZWQtc29tZUBidG14LmZyIiwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.hvQDl6h' +
  '_RCkrxrsWIlAFqszwE9AN3Q_SV1W_mAu_fS0'

const getUserId = async () => {
  const accessToken = await storage.readString('access_token')
  if (!accessToken) {
    return null
  }
  const tokenContent = decodeToken(accessToken)
  return tokenContent?.user_claims?.user_id ?? null
}

async function checkForAppUpdate() {
  try {
    const updateInfo = await HotUpdater.checkForUpdate({
      source: getUpdateSource(`${env.HOT_UPDATER_FUNCTION_URL}`, {
        updateStrategy: 'appVersion',
      }),
    })

    if (!updateInfo) {
      return {
        status: 'No update info',
      }
    }

    return updateInfo
  } catch (error) {
    return null
  }
}

export const CheatcodesScreenDebugInformations: FunctionComponent = function () {
  const [batchInstallationId, setBatchInstallationId] = useState('none')
  const [userEmail, setUserEmail] = useState('')
  const [userId, setUserId] = useState<null | number>(null)
  const [bundleId, setBundleId] = useState<string | null>(null)
  const [updateStatus, setUpdateStatus] = useState<string | null>(null)

  useEffect(() => {
    const bundleId = HotUpdater.getBundleId()
    setBundleId(bundleId)
  }, [])

  useEffect(() => {
    getBatchInstallationID().then(setBatchInstallationId)
  }, [])

  useEffect(() => {
    getUserId().then(setUserId)
  }, [])

  async function fetchMe() {
    try {
      const response = await api.getNativeV1Me()
      setUserEmail(response.email)
    } catch {
      //
    }
  }

  async function handleCheckForAppUpdate() {
    try {
      const updateInfo = await checkForAppUpdate()
      if (updateInfo?.status) {
        setUpdateStatus(updateInfo.status)
      } else {
        setUpdateStatus(`${updateInfo === null ? 'NO UPDATE' : updateInfo.status}`)
      }
    } catch (error) {
      setUpdateStatus('ERROR')
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
      <ViewGap gap={2}>
        <CrashTestButton />
        <Button title="Utiliser un ancien token" onPress={setOldToken} />
        <Button title="Invalider l’access token" onPress={setOldToken} />
        <Button title="Invalider les 2 tokens" onPress={invalidateBothTokens} />
        <Button title="/ME" onPress={fetchMe} />
        <Typo.Body>User email: {userEmail ?? 'unknown'}</Typo.Body>
        <Typo.Body>Batch installation ID: {batchInstallationId}</Typo.Body>
        <Typo.Body>User ID: {userId}</Typo.Body>
        <Separator.Horizontal />
        <Typo.Title4>HOT UPDATER</Typo.Title4>
        <Typo.Body>Bundle ID: {bundleId ?? 'unknown'}</Typo.Body>
        <Typo.Body>Channel: {HotUpdater.getChannel()}</Typo.Body>
        <Typo.Body>App Version: {HotUpdater.getAppVersion()}</Typo.Body>
        <Button title="Reload" onPress={() => HotUpdater.reload()} />
        <Button
          title="HotUpdater.runUpdateProcess()"
          onPress={() =>
            HotUpdater.runUpdateProcess({
              source: `${env.HOT_UPDATER_FUNCTION_URL}`,
            })
          }
        />
        <Button title="Check for App Update" onPress={handleCheckForAppUpdate} />
        <Typo.Body>Update Status: {updateStatus ?? 'unknown'}</Typo.Body>
      </ViewGap>
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
