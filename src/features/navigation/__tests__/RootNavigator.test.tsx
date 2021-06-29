import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { AcceptCgu } from 'features/auth/signup/AcceptCgu'
import { AccountCreated } from 'features/auth/signup/AccountCreated'
import * as splashScreenModule from 'libs/splashscreen'
import { storage } from 'libs/storage'
import { act, render, flushAllPromises } from 'tests/utils'

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

describe.skip('<RootNavigator />', () => {
  afterEach(async () => {
    jest.clearAllMocks()
    await storage.clear('has_accepted_cookie')
  })

  it('should NOT display PrivacyPolicy if splash screen is not yet hidden', async () => {
    // eslint-disable-next-line local-rules/independant-mocks
    jest
      .spyOn(splashScreenModule, 'useSplashScreenContext')
      .mockReturnValue({ isSplashScreenHidden: false })
    const renderAPI = await renderRootNavigator()

    const privacyPolicyTitle = renderAPI.queryByText('Respect de ta vie privée')
    expect(privacyPolicyTitle).toBeFalsy()
    renderAPI.unmount()
  })

  it('should display PrivacyPolicy if splash screen is hidden', async () => {
    // eslint-disable-next-line local-rules/independant-mocks
    jest
      .spyOn(splashScreenModule, 'useSplashScreenContext')
      .mockReturnValue({ isSplashScreenHidden: true })

    const renderAPI = await renderRootNavigator()

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
  afterEach(async () => {
    await storage.clear('has_accepted_cookie')
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

  it('should display force update page when global variable is set', async () => {
    await storage.saveObject('has_accepted_cookie', false)
    const rootNavigator = await renderRootNavigator()
    act(() => {
      global.setMustUpdateApp && global.setMustUpdateApp(true)
    })
    expect(rootNavigator).toMatchSnapshot()
    expect(rootNavigator.queryByText("Mise à jour de l'application")).toBeTruthy()
    act(() => {
      global.setMustUpdateApp && global.setMustUpdateApp(false)
    })
    expect(rootNavigator.queryByText("Mise à jour de l'application")).toBeFalsy()
  })
})

async function renderRootNavigator() {
  const renderAPI = render(
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  )

  await act(flushAllPromises)
  return renderAPI
}
