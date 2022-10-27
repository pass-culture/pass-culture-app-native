import React from 'react'

import { BatchMessaging, BatchPush } from 'libs/react-native-batch'
import { flushAllPromisesWithAct, render } from 'tests/utils'

import { App } from './App'

jest.mock('features/navigation/NavigationContainer/NavigationContainer', () => ({
  AppNavigationContainer: () => 'Placeholder for NavigationContainer',
}))
jest.unmock('libs/network/NetInfoWrapper')

describe('<App /> with mocked RootNavigator', () => {
  it("should override font for Batch's in-app messages", async () => {
    await renderApp()
    expect(BatchMessaging.setFontOverride).toHaveBeenCalled()
  })

  it('should request push notifications permission', async () => {
    await renderApp()
    expect(BatchPush.requestNotificationAuthorization).toHaveBeenCalled()
  })
})

const renderApp = async () => {
  const wrapper = render(<App />)
  await flushAllPromisesWithAct()
  return wrapper
}
