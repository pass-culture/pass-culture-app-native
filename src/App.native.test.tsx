import React from 'react'
import { LogBox } from 'react-native'

import { campaignTracker } from 'libs/campaign'
import { BatchMessaging, BatchPush } from 'libs/react-native-batch'
import { configureGoogleSignin } from 'libs/react-native-google-sso/configureGoogleSignin'
import { render, waitFor } from 'tests/utils'

import { AppWithoutMonitoring } from './App'

jest.mock('features/navigation/NavigationContainer/NavigationContainer', () => ({
  AppNavigationContainer: () => 'Placeholder for NavigationContainer',
}))
jest.unmock('libs/network/NetInfoWrapper')

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

    expect(campaignTracker.useInit).not.toHaveBeenCalled()
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
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
    } as Response)
    renderApp()

    await waitFor(() => {
      expect(LogBox.ignoreAllLogs).toHaveBeenCalledTimes(1)
    })
  })
})

const renderApp = () => render(<AppWithoutMonitoring />)
