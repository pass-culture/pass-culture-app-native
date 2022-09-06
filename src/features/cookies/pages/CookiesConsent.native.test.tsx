import mockdate from 'mockdate'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { api } from 'api/api'
import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { CookiesConsent } from 'features/cookies/pages/CookiesConsent'
import * as Batch from 'features/cookies/startBatch'
import * as Tracking from 'features/cookies/startTracking'
import { campaignTracker } from 'libs/campaign'
import { analytics } from 'libs/firebase/analytics'
import { storage } from 'libs/storage'
import { requestIDFATrackingConsent } from 'libs/trackingConsent/useTrackingConsent'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, fireEvent, flushAllPromisesWithAct, waitFor } from 'tests/utils'

const COOKIES_CONSENT_KEY = 'cookies_consent'
const hideModal = jest.fn()
const Today = new Date(2022, 9, 29)
mockdate.set(Today)
const deviceId = 'testUuidV4'

jest.mock('api/api')
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: jest.fn(), push: jest.fn() }),
  useFocusEffect: jest.fn(),
}))

jest.mock('libs/trackingConsent/useTrackingConsent')
const mockrequestIDFATrackingConsent = requestIDFATrackingConsent as jest.Mock

const mockStartBatch = jest.spyOn(Batch, 'startBatch')
const mockStartTracking = jest.spyOn(Tracking, 'startTracking')

describe('<CookiesConsent/>', () => {
  beforeEach(() => storage.clear(COOKIES_CONSENT_KEY))

  it('should render correctly', async () => {
    const renderAPI = renderCookiesConsent()
    expect(renderAPI).toMatchSnapshot()
  })

  describe('accept all cookies', () => {
    it('should save cookies consent information in storage and log choice', async () => {
      const { getByText } = renderCookiesConsent()
      const acceptAllButton = getByText('Tout accepter')

      fireEvent.press(acceptAllButton)

      await flushAllPromisesWithAct()

      const storageContent = {
        deviceId,
        choiceDatetime: Today.toISOString(),
        consent: {
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: ALL_OPTIONAL_COOKIES,
          refused: [],
        },
      }
      expect(await storage.readObject(COOKIES_CONSENT_KEY)).toEqual(storageContent)
      await waitForExpect(() =>
        expect(api.postnativev1cookiesConsent).toBeCalledWith(storageContent)
      )
    })

    it('should enable tracking', async () => {
      const { getByText } = renderCookiesConsent()
      const acceptAllButton = getByText('Tout accepter')

      fireEvent.press(acceptAllButton)
      await flushAllPromisesWithAct()

      expect(mockStartTracking).toHaveBeenCalledWith(true)
    })

    it('should enable Batch', async () => {
      const { getByText } = renderCookiesConsent()
      const acceptAllButton = getByText('Tout accepter')

      fireEvent.press(acceptAllButton)
      await flushAllPromisesWithAct()

      expect(mockStartBatch).toHaveBeenCalledWith(true)
    })

    it('should enable appsFlyer', async () => {
      const { getByText } = renderCookiesConsent()
      const acceptAllButton = getByText('Tout accepter')

      fireEvent.press(acceptAllButton)
      await flushAllPromisesWithAct()

      expect(campaignTracker.startAppsFlyer).toHaveBeenCalledWith(true)
    })

    it('should log analytics', async () => {
      const { getByText } = renderCookiesConsent()
      const acceptAllButton = getByText('Tout accepter')

      fireEvent.press(acceptAllButton)
      await flushAllPromisesWithAct()

      expect(analytics.logHasAcceptedAllCookies).toHaveBeenCalled()
    })

    it('should request tracking transparency', async () => {
      const { getByText } = renderCookiesConsent()
      const acceptAllButton = getByText('Tout accepter')

      fireEvent.press(acceptAllButton)
      await flushAllPromisesWithAct()

      expect(mockrequestIDFATrackingConsent).toHaveBeenCalled()
    })

    it('should hide modal', async () => {
      const { getByText } = renderCookiesConsent()
      const acceptAllButton = getByText('Tout accepter')

      fireEvent.press(acceptAllButton)
      await flushAllPromisesWithAct()

      expect(hideModal).toBeCalled()
    })
  })

  describe('refuse all cookies', () => {
    it('should save cookies consent information in storage and log choice', async () => {
      const { getByText } = renderCookiesConsent()
      const declineAllButton = getByText('Tout refuser')

      fireEvent.press(declineAllButton)

      await flushAllPromisesWithAct()

      const storageContent = {
        deviceId,
        choiceDatetime: Today.toISOString(),
        consent: {
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: [],
          refused: ALL_OPTIONAL_COOKIES,
        },
      }
      expect(await storage.readObject(COOKIES_CONSENT_KEY)).toEqual(storageContent)
      await waitForExpect(() =>
        expect(api.postnativev1cookiesConsent).toBeCalledWith(storageContent)
      )
    })

    it('should disable tracking', async () => {
      const { getByText } = renderCookiesConsent()
      const declineAllButton = getByText('Tout refuser')

      fireEvent.press(declineAllButton)
      await flushAllPromisesWithAct()

      expect(mockStartTracking).toHaveBeenCalledWith(false)
    })

    it('should opt out from Batch', async () => {
      const { getByText } = renderCookiesConsent()
      const declineAllButton = getByText('Tout refuser')

      fireEvent.press(declineAllButton)
      await flushAllPromisesWithAct()

      expect(mockStartBatch).toHaveBeenCalledWith(false)
    })

    it('should disable appsFlyer', async () => {
      const { getByText } = renderCookiesConsent()
      const declineAllButton = getByText('Tout refuser')

      fireEvent.press(declineAllButton)
      await flushAllPromisesWithAct()

      expect(campaignTracker.startAppsFlyer).toHaveBeenCalledWith(false)
    })

    it('should request tracking transparency', async () => {
      const { getByText } = renderCookiesConsent()
      const declineAllButton = getByText('Tout refuser')

      fireEvent.press(declineAllButton)
      await flushAllPromisesWithAct()

      expect(mockrequestIDFATrackingConsent).toHaveBeenCalled()
    })

    it('should hide modal', async () => {
      const { getByText } = renderCookiesConsent()
      const declineAllButton = getByText('Tout refuser')

      fireEvent.press(declineAllButton)
      await flushAllPromisesWithAct()

      expect(hideModal).toBeCalled()
    })
  })

  describe('make detailled cookie choice', () => {
    it('should save cookies consent information in storage and log choice when user partially accepts cookies', async () => {
      const { getByText, getByTestId } = renderCookiesConsent()

      const chooseCookies = getByText('Choisir les cookies')
      fireEvent.press(chooseCookies)

      const performanceSwitch = getByTestId('Interrupteur-performance')
      fireEvent.press(performanceSwitch)

      const saveChoice = getByText('Enregistrer mes choix')
      fireEvent.press(saveChoice)

      const storageContent = {
        deviceId,
        choiceDatetime: Today.toISOString(),
        consent: {
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: COOKIES_BY_CATEGORY.performance,
          refused: [...COOKIES_BY_CATEGORY.customization, ...COOKIES_BY_CATEGORY.marketing],
        },
      }
      await waitFor(async () => {
        expect(await storage.readObject(COOKIES_CONSENT_KEY)).toEqual(storageContent)
        expect(api.postnativev1cookiesConsent).toBeCalledWith(storageContent)
      })
    })

    it('should call startTracking with false if performance cookies are refused', async () => {
      const { getByText } = renderCookiesConsent()

      const chooseCookies = getByText('Choisir les cookies')
      fireEvent.press(chooseCookies)

      const saveChoice = getByText('Enregistrer mes choix')
      fireEvent.press(saveChoice)
      await flushAllPromisesWithAct()

      expect(mockStartTracking).toHaveBeenCalledWith(false)
    })

    it('should call startBatch with false if customization cookies are refused', async () => {
      const { getByText } = renderCookiesConsent()

      const chooseCookies = getByText('Choisir les cookies')
      fireEvent.press(chooseCookies)

      const saveChoice = getByText('Enregistrer mes choix')
      fireEvent.press(saveChoice)
      await flushAllPromisesWithAct()

      expect(mockStartBatch).toHaveBeenCalledWith(false)
    })

    it('should call startAppsFlyer with false if marketing cookies are refused', async () => {
      const { getByText } = renderCookiesConsent()

      const chooseCookies = getByText('Choisir les cookies')
      fireEvent.press(chooseCookies)

      const saveChoice = getByText('Enregistrer mes choix')
      fireEvent.press(saveChoice)
      await flushAllPromisesWithAct()

      expect(campaignTracker.startAppsFlyer).toHaveBeenCalledWith(false)
    })

    it('should call startTracking with true if performance cookies are accepted', async () => {
      const { getByText, getByTestId } = renderCookiesConsent()

      const chooseCookies = getByText('Choisir les cookies')
      fireEvent.press(chooseCookies)

      const performanceSwitch = getByTestId('Interrupteur-performance')
      fireEvent.press(performanceSwitch)

      const saveChoice = getByText('Enregistrer mes choix')
      fireEvent.press(saveChoice)
      await flushAllPromisesWithAct()

      expect(mockStartTracking).toHaveBeenCalledWith(true)
    })

    it('should call startBatch with true if customization cookies are accepted', async () => {
      const { getByText, getByTestId } = renderCookiesConsent()

      const chooseCookies = getByText('Choisir les cookies')
      fireEvent.press(chooseCookies)

      const customizationSwitch = getByTestId('Interrupteur-customization')
      fireEvent.press(customizationSwitch)

      const saveChoice = getByText('Enregistrer mes choix')
      fireEvent.press(saveChoice)
      await flushAllPromisesWithAct()

      expect(mockStartBatch).toHaveBeenCalledWith(true)
    })

    it('should call startAppsFlyer with true if marketing cookies are accepted', async () => {
      const { getByText, getByTestId } = renderCookiesConsent()

      const chooseCookies = getByText('Choisir les cookies')
      fireEvent.press(chooseCookies)

      const marketingSwitch = getByTestId('Interrupteur-marketing')
      fireEvent.press(marketingSwitch)

      const saveChoice = getByText('Enregistrer mes choix')
      fireEvent.press(saveChoice)
      await flushAllPromisesWithAct()

      expect(campaignTracker.startAppsFlyer).toHaveBeenCalledWith(true)
    })

    it('should log analytics if performance cookies are accepted', async () => {
      const { getByText, getByTestId } = renderCookiesConsent()

      const chooseCookies = getByText('Choisir les cookies')
      fireEvent.press(chooseCookies)

      const performanceSwitch = getByTestId('Interrupteur-performance')
      fireEvent.press(performanceSwitch)

      const saveChoice = getByText('Enregistrer mes choix')
      fireEvent.press(saveChoice)

      await flushAllPromisesWithAct()
      expect(analytics.logHasMadeAChoiceForCookies).toHaveBeenCalledWith({
        from: 'Modal',
        type: { performance: true, customization: false, marketing: false },
      })
    })

    it('should not log analytics if performance cookies are refused', async () => {
      const { getByText } = renderCookiesConsent()

      const chooseCookies = getByText('Choisir les cookies')
      fireEvent.press(chooseCookies)

      const saveChoice = getByText('Enregistrer mes choix')
      fireEvent.press(saveChoice)

      await flushAllPromisesWithAct()
      expect(analytics.disableCollection).toHaveBeenCalled()
    })

    it('should request tracking transparency', async () => {
      const { getByText } = renderCookiesConsent()

      const chooseCookies = getByText('Choisir les cookies')
      fireEvent.press(chooseCookies)

      const saveChoice = getByText('Enregistrer mes choix')
      fireEvent.press(saveChoice)
      await flushAllPromisesWithAct()

      expect(mockrequestIDFATrackingConsent).toHaveBeenCalled()
    })

    it('should hide modale when user saves cookies choice', async () => {
      const { getByText } = await renderCookiesConsent()

      const chooseCookies = getByText('Choisir les cookies')
      fireEvent.press(chooseCookies)

      const saveChoice = getByText('Enregistrer mes choix')
      fireEvent.press(saveChoice)
      await flushAllPromisesWithAct()

      expect(hideModal).toBeCalled()
    })
  })
})

const renderCookiesConsent = () =>
  render(<CookiesConsent visible={true} hideModal={hideModal} />, {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
