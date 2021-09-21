import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { mocked } from 'ts-jest/utils'
import waitForExpect from 'wait-for-expect'

import { AcceptCgu } from 'features/auth/signup/AcceptCgu'
import { AccountCreated } from 'features/auth/signup/AccountCreated/AccountCreated'
import { useMustUpdateApp } from 'features/forceUpdate/useMustUpdateApp'
import * as splashScreenModule from 'libs/splashscreen'
import { storage } from 'libs/storage'
import { render } from 'tests/utils/web'

import { RootNavigator, Route, wrapRoute } from '../RootNavigator'

jest.mock('features/forceUpdate/useMustUpdateApp')
const mockedUseMustUpdateApp = mocked(useMustUpdateApp)
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

// eslint-disable-next-line local-rules/no-allow-console
allowConsole({
  warn: true,
  error: true,
})

describe('<RootNavigator />', () => {
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
      const privacyPolicyTitle = renderAPI.getByText('Respect de ta vie privée')
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
    mockedUseMustUpdateApp.mockReturnValueOnce(true)

    const rootNavigator = await renderRootNavigator()

    expect(rootNavigator).toMatchSnapshot()
    expect(rootNavigator.queryByText("Mise à jour de l'application")).toBeTruthy()
  })
})

async function renderRootNavigator() {
  const renderAPI = render(
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  )

  return renderAPI
}
