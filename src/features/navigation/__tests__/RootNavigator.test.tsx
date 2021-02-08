import { render } from '@testing-library/react-native'
import React from 'react'
import { Text as mockText } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import { act } from 'react-test-renderer'

import { AcceptCgu } from 'features/auth/signup/AcceptCgu'
import { AccountCreated } from 'features/auth/signup/AccountCreated'
import { analytics } from 'libs/analytics'
import { storage } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { flushAllPromises } from 'tests/utils'

import { RootNavigator, Route, wrapRoute } from '../RootNavigator'

jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))
jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))
jest.mock('react-error-boundary', () => ({
  withErrorBoundary: (component: React.ReactNode, _: unknown) => component,
}))
jest.mock('features/navigation/TabBar/TabNavigator', () => ({
  TabNavigator() {
    const Text = mockText
    return <Text>TabNavigator screen</Text>
  },
}))
jest.mock('features/firstLogin/tutorials/pages/FirstTutorial', () => ({
  FirstTutorial() {
    const Text = mockText
    return <Text>FirstTutorial screen</Text>
  },
}))

describe('<RootNavigator />', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.useRealTimers()
    storage.clear('has_seen_tutorials')
  })

  it('show TabNavigator screen on mount when user has already seen tutorials', async () => {
    storage.saveObject('has_seen_tutorials', true)
    const renderAPI = render(reactQueryProviderHOC(<RootNavigator />))
    await act(async () => {
      await flushAllPromises()
    })

    expect(analytics.logScreenView).toBeCalledTimes(1)
    expect(analytics.logScreenView).toBeCalledWith('Home')
    expect(renderAPI.queryByText('TabNavigator screen')).toBeTruthy()
    expect(renderAPI.queryByText('FirstTutorial screen')).toBeFalsy()
    renderAPI.unmount()
  })

  it('show FirstTutorial screen on mount when user has NOT seen tutorials', async () => {
    storage.saveObject('has_seen_tutorials', false)
    const renderAPI = render(reactQueryProviderHOC(<RootNavigator />))
    await act(async () => {
      await flushAllPromises()
    })

    expect(analytics.logScreenView).toBeCalledTimes(1)
    expect(analytics.logScreenView).toBeCalledWith('FirstTutorial')
    expect(renderAPI.queryByText('FirstTutorial screen')).toBeTruthy()
    expect(renderAPI.queryByText('TabNavigator screen')).toBeFalsy()
    renderAPI.unmount()
  })

  it('should call SplashScreen.hide() after 200ms', async () => {
    expect.assertions(2)
    const renderAPI = render(reactQueryProviderHOC(<RootNavigator />))
    await act(async () => {
      await flushAllPromises()
    })

    expect(SplashScreen.hide).toBeCalledTimes(0)
    jest.advanceTimersByTime(200)
    expect(SplashScreen.hide).toBeCalledTimes(1)
    renderAPI.unmount()
  })
})

describe('wrapRoute()', () => {
  const hoc = jest.fn()

  beforeEach(() => {
    hoc.mockClear()
  })

  it('should wrap a route when declared with hocs wrapper', () => {
    const routeWithHoc: Route = {
      name: 'AcceptCgu',
      component: AcceptCgu,
      hoc,
    }
    wrapRoute(routeWithHoc)
    expect(hoc).toBeCalledWith(AcceptCgu)
  })

  it('should not wrap a route when not declared with hocs wrapper', () => {
    const routeWithoutHoc: Route = {
      name: 'AccountCreated',
      component: AccountCreated,
    }
    wrapRoute(routeWithoutHoc)
    expect(hoc).not.toBeCalledWith(AccountCreated)
  })
})
