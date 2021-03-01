import { NavigationContainer } from '@react-navigation/native'
import { render } from '@testing-library/react-native'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { AcceptCgu } from 'features/auth/signup/AcceptCgu'
import { AccountCreated } from 'features/auth/signup/AccountCreated'
import * as splashScreenModule from 'libs/splashscreen'

import { RootNavigator, Route, wrapRoute } from '../RootNavigator'

jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))
jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))
jest.mock('react-error-boundary', () => ({
  withErrorBoundary: (component: React.ReactNode, _: unknown) => component,
}))
jest.mock('features/navigation/TabBar/TabNavigator', () => ({
  TabNavigator: () => null,
}))

describe('<RootNavigator />', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should NOT display PrivacyPolicy if splash screen is not yet hidden', async () => {
    jest
      .spyOn(splashScreenModule, 'useSplashScreenContext')
      .mockReturnValue({ isSplashScreenHidden: false })
    const renderAPI = renderRootNavigator()

    const privacyPolicyTitle = renderAPI.queryByText('Respect de ta vie privée')
    expect(privacyPolicyTitle).toBeFalsy()
    renderAPI.unmount()
  })

  it('should display PrivacyPolicy if splash screen is hidden', async () => {
    jest
      .spyOn(splashScreenModule, 'useSplashScreenContext')
      .mockReturnValue({ isSplashScreenHidden: true })
    const renderAPI = renderRootNavigator()

    await waitForExpect(() => {
      const privacyPolicyTitle = renderAPI.queryByText('Respect de ta vie privée')
      expect(privacyPolicyTitle).toBeTruthy()
    })
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

function renderRootNavigator() {
  return render(
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  )
}
