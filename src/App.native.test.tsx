import React from 'react'
import { LogBox } from 'react-native'

import { campaignTracker } from 'libs/campaign'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { BatchMessaging, BatchPush } from 'libs/react-native-batch'
import { configureGoogleSignin } from 'libs/react-native-google-sso/configureGoogleSignin'
import { render, waitFor } from 'tests/utils'

import { AppWithoutMonitoring } from './App'

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.mock('features/navigation/NavigationContainer/NavigationContainer', () => ({
  AppNavigationContainer: () => 'Placeholder for NavigationContainer',
}))

jest.mock('libs/e2e/getIsMaestro', () => ({
  getIsMaestro: () => Promise.resolve(true),
}))
jest.mock('libs/campaign')
jest.mock('react-native/Libraries/LogBox/LogBox')

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<App /> with mocked RootNavigator', () => {
  it("should override font for Batch's in-app messages", () => {
    renderApp()

    expect(BatchMessaging.setFontOverride).toHaveBeenCalledTimes(1)
  })

  it('should request push notifications permission', () => {
    renderApp()

    expect(BatchPush.requestNotificationAuthorization).toHaveBeenCalledTimes(1)
  })

  it('should not init AppsFlyer on launch', () => {
    renderApp()

    expect(campaignTracker.init).not.toHaveBeenCalled()
  })

  it('should configure Google signin on launch', () => {
    renderApp()

    expect(configureGoogleSignin).toHaveBeenCalledWith({
      iosClientId: 'GOOGLE_IOS_CLIENT_ID',
      webClientId: 'GOOGLE_CLIENT_ID',
      offlineAccess: true,
    })
  })

  it('should disable log box when maestro tests are running', async () => {
    renderApp()

    await waitFor(() => {
      expect(LogBox.ignoreAllLogs).toHaveBeenCalledTimes(1)
    })
  })
})

const renderApp = () => render(<AppWithoutMonitoring />)
