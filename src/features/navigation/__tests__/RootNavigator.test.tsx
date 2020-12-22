import { render } from '@testing-library/react-native'
import React from 'react'
import { act } from 'react-test-renderer'

import { analytics } from 'libs/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { flushAllPromises } from 'tests/utils'

import { RootNavigator } from '../RootNavigator'

jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))
jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))
jest.mock('react-error-boundary', () => ({
  withErrorBoundary: (component: React.ReactNode, _: unknown) => component,
}))

describe('RootNavigator', () => {
  beforeAll(() => jest.useFakeTimers())
  it('logs once initial screen on mount', async () => {
    const { unmount } = render(reactQueryProviderHOC(<RootNavigator />))
    await act(async () => {
      await flushAllPromises()
    })
    expect(analytics.logScreenView).toHaveBeenCalledTimes(1)
    expect(analytics.logScreenView).toHaveBeenCalledWith('Home')
    unmount()
  })
})
