import React from 'react'

import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { ConsentState } from 'features/cookies/enums'
import * as Cookies from 'features/cookies/helpers/useCookies'
import * as CookiesUpToDate from 'features/cookies/helpers/useIsCookiesListUpToDate'
import { ConsentStatus } from 'features/cookies/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { flushAllPromisesWithAct, render } from 'tests/utils'

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
  .mockReturnValue(true)

jest.mock('features/navigation/navigationRef')

describe('<PrivacyPolicy />', () => {
  it('should not show cookies modal when fetching cookies is loading', async () => {
    mockUseCookies.mockReturnValueOnce({
      ...defaultUseCookies,
      cookiesConsent: { state: ConsentState.LOADING },
    })
    const renderAPI = await renderPrivacyPolicy()

    const title = renderAPI.queryByText('Choisir les cookies')
    expect(title).toBeNull()
  })

  it('should show cookies modal when cookies is unknown', async () => {
    mockUseCookies.mockReturnValueOnce({
      ...defaultUseCookies,
      cookiesConsent: { state: ConsentState.UNKNOWN },
    })
    const renderAPI = await renderPrivacyPolicy()

    const title = renderAPI.queryByText('Choisir les cookies')
    expect(title).toBeTruthy()
  })

  it('should not show cookies modal when fetching cookies is defined but user has made cookie choice', async () => {
    mockUseIsCookiesListUpToDate.mockReturnValueOnce(true)
    mockUseCookies.mockReturnValueOnce({
      ...defaultUseCookies,
      cookiesConsent: {
        state: ConsentState.HAS_CONSENT,
        value: consentValue,
      },
    })
    const renderAPI = await renderPrivacyPolicy()

    const title = renderAPI.queryByText('Choisir les cookies')
    expect(title).toBeFalsy()
  })

  it('should show cookies modal when fetching cookies is defined and user has made cookie choice', async () => {
    mockUseIsCookiesListUpToDate.mockReturnValueOnce(false)
    mockUseCookies.mockReturnValueOnce({
      ...defaultUseCookies,
      cookiesConsent: {
        state: ConsentState.HAS_CONSENT,
        value: consentValue,
      },
    })
    const renderAPI = await renderPrivacyPolicy()

    const title = renderAPI.queryByText('Choisir les cookies')
    expect(title).toBeTruthy()
  })
})

const renderPrivacyPolicy = async () => {
  const renderAPI = render(<PrivacyPolicy />, {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
  await flushAllPromisesWithAct()
  return renderAPI
}
