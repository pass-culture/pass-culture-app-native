import mockdate from 'mockdate'
import React from 'react'

import Package from '__mocks__/package.json'
import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import * as SetMarketingParams from 'features/cookies/helpers/setMarketingParams'
import * as Tracking from 'features/cookies/helpers/startTracking'
import * as TrackingAcceptedCookies from 'features/cookies/helpers/startTrackingAcceptedCookies'
import { CookiesConsent } from 'features/cookies/pages/CookiesConsent'
import { navigationRef } from 'features/navigation/navigationRef'
import { campaignTracker } from 'libs/campaign/__mocks__'
import { analytics } from 'libs/firebase/analytics'
import { storage } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, fireEvent, superFlushWithAct, act, flushAllPromisesWithAct } from 'tests/utils'

const COOKIES_CONSENT_KEY = 'cookies'
const hideModal = jest.fn()
const Today = new Date(2022, 9, 29)
mockdate.set(Today)
const deviceId = 'testUuidV4'

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: jest.fn(), push: jest.fn() }),
  useFocusEffect: jest.fn(),
}))

jest.mock('features/navigation/navigationRef')

const mockStartTracking = jest.spyOn(Tracking, 'startTracking')
const mockStartTrackingAcceptedCookies = jest.spyOn(
  TrackingAcceptedCookies,
  'startTrackingAcceptedCookies'
)

const UTM_PARAMS = {
  utm_campaign: 'test',
  utm_medium: 'test',
  utm_source: 'test',
}

jest.spyOn(navigationRef, 'getCurrentRoute').mockReturnValue({
  params: UTM_PARAMS,
  key: 'UTMParams',
  name: 'UTMParams',
})

const setMarketingParamsSpy = jest.spyOn(SetMarketingParams, 'setMarketingParams')

describe('<CookiesConsent/>', () => {
  beforeEach(() => storage.clear(COOKIES_CONSENT_KEY))

  it('should render correctly', async () => {
    const renderAPI = await renderCookiesConsent()
    expect(renderAPI).toMatchSnapshot()
  })

  describe('accept all cookies', () => {
    it('should persist cookies consent information', async () => {
      const { getByText } = await renderCookiesConsent()
      const acceptAllButton = getByText('Tout accepter')

      act(() => {
        fireEvent.press(acceptAllButton)
      })
      await superFlushWithAct()

      const storageContent = {
        buildVersion: Package.build,
        deviceId,
        choiceDatetime: Today.toISOString(),
        consent: {
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: ALL_OPTIONAL_COOKIES,
          refused: [],
        },
      }
      expect(await storage.readObject(COOKIES_CONSENT_KEY)).toEqual(storageContent)
    })

    it('should enable tracking', async () => {
      const { getByText } = await renderCookiesConsent()
      const acceptAllButton = getByText('Tout accepter')

      act(() => {
        fireEvent.press(acceptAllButton)
      })
      await superFlushWithAct()

      expect(mockStartTracking).toHaveBeenCalledWith(true)
    })

    it('should log analytics', async () => {
      const { getByText } = await renderCookiesConsent()
      const acceptAllButton = getByText('Tout accepter')

      act(() => {
        fireEvent.press(acceptAllButton)
      })
      await superFlushWithAct()

      expect(analytics.logHasAcceptedAllCookies).toHaveBeenCalledTimes(1)
    })

    it('should init AppsFlyer', async () => {
      const { getByText } = await renderCookiesConsent()
      const acceptAllButton = getByText('Tout accepter')

      act(() => {
        fireEvent.press(acceptAllButton)
      })
      await superFlushWithAct()

      expect(campaignTracker.useInit).toHaveBeenNthCalledWith(1, true)
    })

    it('should save UTM params', async () => {
      const { getByText } = await renderCookiesConsent()
      const acceptAllButton = getByText('Tout accepter')

      act(() => {
        fireEvent.press(acceptAllButton)
      })
      await superFlushWithAct()

      expect(setMarketingParamsSpy).toHaveBeenNthCalledWith(1, UTM_PARAMS, ALL_OPTIONAL_COOKIES)
    })

    it('should hide modal', async () => {
      const { getByText } = await renderCookiesConsent()
      const acceptAllButton = getByText('Tout accepter')

      act(() => {
        fireEvent.press(acceptAllButton)
      })
      await superFlushWithAct()

      expect(hideModal).toHaveBeenCalledTimes(1)
    })
  })

  describe('refuse all cookies', () => {
    it('should persist cookies consent information', async () => {
      const { getByText } = await renderCookiesConsent()
      const declineAllButton = getByText('Tout refuser')

      act(() => {
        fireEvent.press(declineAllButton)
      })
      await superFlushWithAct()

      const storageContent = {
        buildVersion: Package.build,
        deviceId,
        choiceDatetime: Today.toISOString(),
        consent: {
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: [],
          refused: ALL_OPTIONAL_COOKIES,
        },
      }
      expect(await storage.readObject(COOKIES_CONSENT_KEY)).toEqual(storageContent)
    })

    it('should disable tracking', async () => {
      const { getByText } = await renderCookiesConsent()
      const declineAllButton = getByText('Tout refuser')

      act(() => {
        fireEvent.press(declineAllButton)
      })
      await superFlushWithAct()

      expect(mockStartTracking).toHaveBeenCalledWith(false)
    })

    it('should not init AppsFlyer', async () => {
      const { getByText } = await renderCookiesConsent()
      const declineAllButton = getByText('Tout refuser')

      act(() => {
        fireEvent.press(declineAllButton)
      })
      await superFlushWithAct()

      expect(campaignTracker.useInit).not.toHaveBeenCalled()
    })

    it('should not set marketing params', async () => {
      const { getByText } = await renderCookiesConsent()
      const declineAllButton = getByText('Tout refuser')

      act(() => {
        fireEvent.press(declineAllButton)
      })
      await superFlushWithAct()

      expect(setMarketingParamsSpy).not.toHaveBeenCalled()
    })

    it('should hide modal', async () => {
      const { getByText } = await renderCookiesConsent()
      const declineAllButton = getByText('Tout refuser')

      act(() => {
        fireEvent.press(declineAllButton)
      })
      await superFlushWithAct()

      expect(hideModal).toHaveBeenCalledTimes(1)
    })
  })

  describe('make detailled cookie choice', () => {
    it('should persist cookies consent information when user partially accepts cookies', async () => {
      const { getByText, getByTestId } = await renderCookiesConsent()

      const chooseCookies = getByText('Choisir les cookies')
      fireEvent.press(chooseCookies)

      const performanceSwitch = getByTestId('Interrupteur-performance')
      fireEvent.press(performanceSwitch)

      const saveChoice = getByText('Enregistrer mes choix')
      fireEvent.press(saveChoice)
      await flushAllPromisesWithAct()

      const storageContent = {
        buildVersion: Package.build,
        deviceId,
        choiceDatetime: Today.toISOString(),
        consent: {
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: COOKIES_BY_CATEGORY.performance,
          refused: [...COOKIES_BY_CATEGORY.customization, ...COOKIES_BY_CATEGORY.marketing],
        },
      }
      expect(await storage.readObject(COOKIES_CONSENT_KEY)).toEqual(storageContent)
    })

    it('should call startTrackingAcceptedCookies with empty array if all cookies are refused', async () => {
      const { getByText } = await renderCookiesConsent()

      const chooseCookies = getByText('Choisir les cookies')
      fireEvent.press(chooseCookies)

      const saveChoice = getByText('Enregistrer mes choix')
      fireEvent.press(saveChoice)
      await superFlushWithAct()

      expect(mockStartTrackingAcceptedCookies).toHaveBeenCalledWith([])
    })

    it('should call startTrackingAcceptedCookies with performance if performance cookies are accepted', async () => {
      const { getByText, getByTestId } = await renderCookiesConsent()

      const chooseCookies = getByText('Choisir les cookies')
      fireEvent.press(chooseCookies)

      const performanceSwitch = getByTestId('Interrupteur-performance')
      fireEvent.press(performanceSwitch)

      const saveChoice = getByText('Enregistrer mes choix')
      fireEvent.press(saveChoice)
      await superFlushWithAct()

      expect(mockStartTrackingAcceptedCookies).toHaveBeenCalledWith(COOKIES_BY_CATEGORY.performance)
    })

    it('should log analytics if performance cookies are accepted', async () => {
      const { getByText, getByTestId } = await renderCookiesConsent()

      const chooseCookies = getByText('Choisir les cookies')
      fireEvent.press(chooseCookies)

      const performanceSwitch = getByTestId('Interrupteur-performance')
      fireEvent.press(performanceSwitch)

      const saveChoice = getByText('Enregistrer mes choix')
      fireEvent.press(saveChoice)

      await superFlushWithAct()
      expect(analytics.logHasMadeAChoiceForCookies).toHaveBeenCalledWith({
        from: 'Modal',
        type: { performance: true, customization: false, marketing: false },
      })
    })

    it('should call setMarketingParams with empty array when all cookies are refused', async () => {
      const { getByText } = await renderCookiesConsent()

      const chooseCookies = getByText('Choisir les cookies')
      fireEvent.press(chooseCookies)

      const saveChoice = getByText('Enregistrer mes choix')
      fireEvent.press(saveChoice)
      await superFlushWithAct()

      expect(setMarketingParamsSpy).toHaveBeenNthCalledWith(1, UTM_PARAMS, [])
    })

    it('should call setMarketingParams with customization cookies when they are accepted', async () => {
      const { getByTestId, getByText } = await renderCookiesConsent()

      const chooseCookies = getByText('Choisir les cookies')
      fireEvent.press(chooseCookies)

      const customizationSwitch = getByTestId('Interrupteur-customization')
      fireEvent.press(customizationSwitch)

      const saveChoice = getByText('Enregistrer mes choix')
      fireEvent.press(saveChoice)
      await superFlushWithAct()

      expect(setMarketingParamsSpy).toHaveBeenNthCalledWith(
        1,
        UTM_PARAMS,
        COOKIES_BY_CATEGORY.customization
      )
    })

    it('should hide modale when user saves cookies choice', async () => {
      const { getByText } = await renderCookiesConsent()

      const chooseCookies = getByText('Choisir les cookies')
      fireEvent.press(chooseCookies)

      const saveChoice = getByText('Enregistrer mes choix')
      fireEvent.press(saveChoice)
      await superFlushWithAct()

      expect(hideModal).toHaveBeenCalledTimes(1)
    })
  })
})

const renderCookiesConsent = async () => {
  const renderAPI = render(<CookiesConsent visible hideModal={hideModal} />, {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
  await flushAllPromisesWithAct()
  return renderAPI
}
