import React from 'react'

import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { ConsentState } from 'features/cookies/enums'
import * as Cookies from 'features/cookies/helpers/useCookies'
import * as CookiesUpToDate from 'features/cookies/helpers/useIsCookiesListUpToDate'
import { ConsentStatus } from 'features/cookies/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

import { PrivacyPolicy } from './PrivacyPolicy'

const consentState: ConsentStatus = { state: ConsentState.LOADING }
const consentValue = {
  mandatory: COOKIES_BY_CATEGORY.essential,
  accepted: ALL_OPTIONAL_COOKIES,
  refused: [],
}

const defaultUseCookies = {
  cookiesConsent: consentState,
  setCookiesConsent: jest.fn(),
  setUserId: jest.fn(),
}
const mockUseCookies = jest.spyOn(Cookies, 'useCookies').mockReturnValue(defaultUseCookies)

const mockUseIsCookiesListUpToDate = jest
  .spyOn(CookiesUpToDate, 'useIsCookiesListUpToDate')
  .mockReturnValue({ isCookiesListUpToDate: true, cookiesLastUpdate: undefined })

jest.mock('features/navigation/navigationRef')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<PrivacyPolicy />', () => {
  it('should not show cookies modal when fetching cookies is loading', async () => {
    mockUseCookies.mockReturnValueOnce({
      ...defaultUseCookies,
      cookiesConsent: { state: ConsentState.LOADING },
    })
    await renderPrivacyPolicy()

    const title = screen.queryByText('Choisir les cookies')

    expect(title).not.toBeOnTheScreen()
  })

  it('should show cookies modal when cookies is unknown', async () => {
    mockUseCookies.mockReturnValueOnce({
      ...defaultUseCookies,
      cookiesConsent: { state: ConsentState.UNKNOWN },
    })
    await renderPrivacyPolicy()

    const title = screen.queryByText('Choisir les cookies')

    expect(title).toBeOnTheScreen()
  })

  it('should not show cookies modal when fetching cookies is defined but user has made cookie choice', async () => {
    mockUseIsCookiesListUpToDate.mockReturnValueOnce({
      isCookiesListUpToDate: true,
      cookiesLastUpdate: undefined,
    })
    mockUseCookies.mockReturnValueOnce({
      ...defaultUseCookies,
      cookiesConsent: {
        state: ConsentState.HAS_CONSENT,
        value: consentValue,
      },
    })
    await renderPrivacyPolicy()

    const title = screen.queryByText('Choisir les cookies')

    expect(title).not.toBeOnTheScreen()
  })

  it('should show cookies modal when fetching cookies is defined and user has made cookie choice', async () => {
    mockUseIsCookiesListUpToDate.mockReturnValueOnce({
      isCookiesListUpToDate: false,
      cookiesLastUpdate: undefined,
    })
    mockUseCookies.mockReturnValueOnce({
      ...defaultUseCookies,
      cookiesConsent: {
        state: ConsentState.HAS_CONSENT,
        value: consentValue,
      },
    })
    await renderPrivacyPolicy()

    const title = screen.queryByText('Choisir les cookies')

    expect(title).toBeOnTheScreen()
  })
})

const renderPrivacyPolicy = async () => {
  render(<PrivacyPolicy />, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
