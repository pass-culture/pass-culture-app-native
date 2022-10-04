import React from 'react'

import * as BatchLocalLib from 'features/notifications/batchNotifications'
import { flushAllPromisesWithAct, render } from 'tests/utils'

import { App } from './App'

jest.mock('features/notifications/batchNotifications', () => ({
  useStartBatchNotification: jest.fn(),
}))
jest.mock('features/navigation/NavigationContainer/NavigationContainer', () => ({
  AppNavigationContainer: () => 'Placeholder for NavigationContainer',
}))
jest.unmock('libs/network/NetInfoWrapper')

describe('<App /> with mocked RootNavigator', () => {
  it('should call startBatchNotification() to optin to notifications', async () => {
    await renderApp()
    expect(BatchLocalLib.useStartBatchNotification).toHaveBeenCalled()
  })
})

const renderApp = async () => {
  const wrapper = render(<App />)
  await flushAllPromisesWithAct()
  return wrapper
}
