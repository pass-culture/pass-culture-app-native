import { render } from '@testing-library/react-native'
import React from 'react'
import SplashScreen from 'react-native-splash-screen'

import * as BatchLocalLib from 'libs/notifications'

import { App } from './App'

jest.mock('./libs/notifications', () => ({
  useStartBatchNotification: jest.fn(),
}))
jest.mock('features/navigation/RootNavigator', () => ({
  RootNavigator() {
    return 'Placeholder for RootNavigator'
  },
}))

describe('<App /> with mocked RootTabNavigator', () => {
  it('should render', () => {
    const { toJSON } = render(<App />)

    expect(toJSON()).toMatchSnapshot()
  })

  it('should call startBatchNotification() to optin to notifications', () => {
    render(<App />)

    expect(BatchLocalLib.useStartBatchNotification).toHaveBeenCalled()
  })

  it('should call SplashScreen.hide() after 500ms', () => {
    expect.assertions(3)
    jest.useFakeTimers()
    render(<App />)

    expect(SplashScreen.hide).toHaveBeenCalledTimes(0)

    jest.advanceTimersByTime(100)
    expect(SplashScreen.hide).toHaveBeenCalledTimes(0)

    jest.advanceTimersByTime(400)
    expect(SplashScreen.hide).toHaveBeenCalledTimes(1)
  })
})
