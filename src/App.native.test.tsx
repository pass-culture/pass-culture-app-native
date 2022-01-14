import React from 'react'
import { act } from 'react-test-renderer'

import * as BatchLocalLib from 'libs/notifications'
import { flushAllPromises, render } from 'tests/utils'

import { App } from './App'

jest.mock('./libs/notifications', () => ({
  useStartBatchNotification: jest.fn(),
}))
jest.mock('features/navigation/NavigationContainer/NavigationContainer', () => ({
  AppNavigationContainer: () => 'Placeholder for NavigationContainer',
}))
jest.mock('libs/i18n', () => ({
  activate: jest.fn(),
}))

describe('<App /> with mocked RootNavigator', () => {
  it('should call startBatchNotification() to optin to notifications', async () => {
    await renderApp()
    expect(BatchLocalLib.useStartBatchNotification).toHaveBeenCalled()
  })
})

const renderApp = async () => {
  const wrapper = render(<App />)
  await act(async () => {
    await flushAllPromises()
  })
  return wrapper
}
