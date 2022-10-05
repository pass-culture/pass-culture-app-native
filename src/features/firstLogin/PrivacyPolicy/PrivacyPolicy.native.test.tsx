import React from 'react'
import waitForExpect from 'wait-for-expect'

import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import * as CookiesExpiration from 'features/cookies/helpers/isConsentChoiceExpired'
import * as Cookies from 'features/cookies/helpers/useCookies'
import * as CookiesUpToDate from 'features/cookies/helpers/useIsCookiesListUpToDate'
import { analytics } from 'libs/firebase/analytics'
import { storage } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { flushAllPromisesWithAct, fireEvent, render } from 'tests/utils'

import { PrivacyPolicy } from './PrivacyPolicy'

const mockSettings = jest.fn().mockReturnValue({ data: { appEnableCookiesV2: false } })
jest.mock('features/auth/settings', () => ({
  useAppSettings: jest.fn(() => mockSettings()),
}))

const defaultUseCookies = {
  cookiesConsent: {
    mandatory: COOKIES_BY_CATEGORY.essential,
    accepted: ALL_OPTIONAL_COOKIES,
    refused: [],
  },
  setCookiesConsent: jest.fn(),
  setUserId: jest.fn(),
}
const mockUseCookies = jest.spyOn(Cookies, 'useCookies').mockReturnValue(defaultUseCookies)

const mockUseIsCookiesListUpToDate = jest
  .spyOn(CookiesUpToDate, 'useIsCookiesListUpToDate')
  .mockReturnValue(true)

const mockIsConsentExpired = jest
  .spyOn(CookiesExpiration, 'isConsentChoiceExpired')
  .mockResolvedValue(false)

describe('<PrivacyPolicy />', () => {
  describe('Cookies Modal V1', () => {
    afterEach(() => {
      storage.clear('has_accepted_cookie')
    })

    it('should not show cookies modal V2 when appEnableCookiesV2 feature flag is desactivated', async () => {
      const renderAPI = render(<PrivacyPolicy />)
      await flushAllPromisesWithAct()

      const title = renderAPI.queryByText('Choisir les cookies')
      expect(title).toBeFalsy()
    })

    it('should show modal when has_accepted_cookie is null', async () => {
      const renderAPI = render(<PrivacyPolicy />)
      await flushAllPromisesWithAct()

      const title = renderAPI.queryByText('Respect de ta vie privée')
      expect(title).toBeTruthy()
    })

    it('should NOT show modal when has_accepted_cookie is false', async () => {
      await storage.saveObject('has_accepted_cookie', false)
      const renderAPI = render(<PrivacyPolicy />)
      await flushAllPromisesWithAct()

      const title = renderAPI.queryByText('Respect de ta vie privée')
      expect(title).toBeFalsy()
    })

    it('should NOT show modal when has_accepted_cookie is true', async () => {
      await storage.saveObject('has_accepted_cookie', true)
      const renderAPI = render(<PrivacyPolicy />)
      await flushAllPromisesWithAct()

      const title = renderAPI.queryByText('Respect de ta vie privée')
      expect(title).toBeFalsy()
    })

    it('should close modal and set has_accepted_cookie to true in storage on approval', async () => {
      expect(await storage.readObject('has_accepted_cookie')).toBeNull()
      const renderAPI = render(<PrivacyPolicy />)
      await flushAllPromisesWithAct()

      expect(await storage.readObject('has_accepted_cookie')).toBeNull()
      const title = renderAPI.queryByText('Respect de ta vie privée')
      expect(title).toBeTruthy()

      fireEvent.press(renderAPI.getByText('Autoriser'))
      await flushAllPromisesWithAct()

      expect(await storage.readObject('has_accepted_cookie')).toBe(true)
      expect(renderAPI.queryByText('Autoriser')).toBeNull()
    })

    it('should close modal and set has_accepted_cookie to false in storage on refusal', async () => {
      expect(await storage.readObject('has_accepted_cookie')).toBeNull()
      const renderAPI = render(<PrivacyPolicy />)
      await flushAllPromisesWithAct()

      expect(await storage.readObject('has_accepted_cookie')).toBeNull()
      const title = renderAPI.queryByText('Respect de ta vie privée')
      expect(title).toBeTruthy()

      fireEvent.press(renderAPI.getByTestId('rightIcon'))
      await flushAllPromisesWithAct()

      expect(await storage.readObject('has_accepted_cookie')).toBe(false)
      expect(renderAPI.queryByText('Autoriser')).toBeNull()
      expect(analytics.logHasRefusedCookie).toHaveBeenCalled()
      await flushAllPromisesWithAct()
      expect(analytics.disableCollection).toHaveBeenCalled()
    })
  })

  describe('Cookies Modal V2', () => {
    beforeAll(() => {
      mockSettings.mockReturnValue({ data: { appEnableCookiesV2: true } })
    })

    it('should show cookies modal V2 when appEnableCookiesV2 feature flag is activated', async () => {
      mockUseCookies.mockReturnValueOnce({ ...defaultUseCookies, cookiesConsent: null })
      const renderAPI = await renderPrivacyPolicyV2()

      const title = renderAPI.queryByText('Choisir les cookies')
      expect(title).toBeTruthy()
    })

    it('should not show cookies modal V2 when appEnableCookiesV2 feature flag is activated and fetching cookies is loading', async () => {
      mockUseCookies.mockReturnValueOnce({ ...defaultUseCookies, cookiesConsent: undefined })
      const renderAPI = await renderPrivacyPolicyV2()

      const title = renderAPI.queryByText('Choisir les cookies')
      expect(title).toBeNull()
    })

    it('should not show cookies modal V2 when appEnableCookiesV2 feature flag is activated and user has made consent choice', async () => {
      const renderAPI = await renderPrivacyPolicyV2()

      const title = renderAPI.queryByText('Choisir les cookies')
      expect(title).toBeNull()
    })

    it('should not show cookies modal V2 when user has made a consent choice', async () => {
      const renderAPI = await renderPrivacyPolicyV2()

      const title = renderAPI.queryByText('Choisir les cookies')
      await waitForExpect(() => {
        expect(title).toBeNull()
      })
    })

    it('should show cookies modal V2 when user has made a consent choice but consent has expired', async () => {
      mockIsConsentExpired.mockResolvedValueOnce(true)

      const renderAPI = await renderPrivacyPolicyV2()

      const title = renderAPI.queryByText('Choisir les cookies')
      expect(title).toBeTruthy()
    })

    it('should show cookies modal V2 when user has made a consent choice but cookies list is not up to date', async () => {
      mockUseIsCookiesListUpToDate.mockReturnValueOnce(false)

      const renderAPI = await renderPrivacyPolicyV2()

      const title = renderAPI.queryByText('Choisir les cookies')
      expect(title).toBeTruthy()
    })
  })
})

const renderPrivacyPolicyV2 = async () => {
  const renderAPI = render(<PrivacyPolicy />, {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
  await flushAllPromisesWithAct()
  return renderAPI
}
