import { render } from '@testing-library/react-native'
import React from 'react'

import { App } from './App'
import * as BatchLocalLib from './libs/notifications'

jest.mock('./libs/notifications', () => ({
  startBatchNotification: jest.fn(),
}))
jest.mock('features/navigation/RootNavigator', () => ({
  RootNavigator() {
    return 'Placeholder for RootNavigator'
  },
}))

describe('<App /> with mocked RootNavigator', () => {
  it('should render', () => {
    const { toJSON } = render(<App />)

    expect(toJSON()).toMatchSnapshot()
  })

  it('should call startBatchNotification() to optin to notifications', () => {
    render(<App />)

    expect(BatchLocalLib.startBatchNotification).toHaveBeenCalled()
  })
})
