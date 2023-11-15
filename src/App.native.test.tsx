import React from 'react'
import { LogBox } from 'react-native'

import { campaignTracker } from 'libs/campaign'
import { BatchMessaging, BatchPush } from 'libs/react-native-batch'
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
