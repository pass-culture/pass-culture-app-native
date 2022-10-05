import mockdate from 'mockdate'
import React from 'react'

import Package from '__mocks__/package.json'
import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import * as Tracking from 'features/cookies/helpers/startTracking'
import * as TrackingAcceptedCookies from 'features/cookies/helpers/startTrackingAcceptedCookies'
import { CookiesConsent } from 'features/cookies/pages/CookiesConsent'
import { analytics } from 'libs/firebase/analytics'
import { storage } from 'libs/storage'
import { requestIDFATrackingConsent } from 'libs/trackingConsent/useTrackingConsent'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, fireEvent, superFlushWithAct, act, flushAllPromisesWithAct } from 'tests/utils'

const mockSettings = jest.fn().mockReturnValue({ data: { appEnableCookiesV2: true } })
jest.mock('features/auth/settings', () => ({
  useAppSettings: jest.fn(() => mockSettings()),
}))

const COOKIES_CONSENT_KEY = 'cookies_consent'
const hideModal = jest.fn()
const Today = new Date(2022, 9, 29)
mockdate.set(Today)
const deviceId = 'testUuidV4'

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: jest.fn(), push: jest.fn() }),
  useFocusEffect: jest.fn(),
}))

jest.mock('libs/trackingConsent/useTrackingConsent')
const mockrequestIDFATrackingConsent = requestIDFATrackingConsent as jest.Mock

const mockStartTracking = jest.spyOn(Tracking, 'startTracking')
const mockStartTrackingAcceptedCookies = jest.spyOn(
  TrackingAcceptedCookies,
  'startTrackingAcceptedCookies'
)

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

      expect(analytics.logHasAcceptedAllCookies).toHaveBeenCalled()
    })

    it('should request tracking transparency', async () => {
      const { getByText } = await renderCookiesConsent()
      const acceptAllButton = getByText('Tout accepter')

      act(() => {
        fireEvent.press(acceptAllButton)
      })
      await superFlushWithAct()

      expect(mockrequestIDFATrackingConsent).toHaveBeenCalled()
    })

    it('should hide modal', async () => {
      const { getByText } = await renderCookiesConsent()
      const acceptAllButton = getByText('Tout accepter')

      act(() => {
        fireEvent.press(acceptAllButton)
      })
      await superFlushWithAct()

      expect(hideModal).toBeCalled()
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

    it('should request tracking transparency', async () => {
      const { getByText } = await renderCookiesConsent()
      const declineAllButton = getByText('Tout refuser')

      act(() => {
        fireEvent.press(declineAllButton)
      })
      await superFlushWithAct()

      expect(mockrequestIDFATrackingConsent).toHaveBeenCalled()
    })

    it('should hide modal', async () => {
      const { getByText } = await renderCookiesConsent()
      const declineAllButton = getByText('Tout refuser')

      act(() => {
        fireEvent.press(declineAllButton)
      })
      await superFlushWithAct()

      expect(hideModal).toBeCalled()
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

    it('should request tracking transparency', async () => {
      const { getByText } = await renderCookiesConsent()

      const chooseCookies = getByText('Choisir les cookies')
      fireEvent.press(chooseCookies)

      const saveChoice = getByText('Enregistrer mes choix')
      fireEvent.press(saveChoice)
      await superFlushWithAct()

      expect(mockrequestIDFATrackingConsent).toHaveBeenCalled()
    })

    it('should hide modale when user saves cookies choice', async () => {
      const { getByText } = await renderCookiesConsent()

      const chooseCookies = getByText('Choisir les cookies')
      fireEvent.press(chooseCookies)

      const saveChoice = getByText('Enregistrer mes choix')
      fireEvent.press(saveChoice)
      await superFlushWithAct()

      expect(hideModal).toBeCalled()
    })
  })
})

const renderCookiesConsent = async () => {
  const renderAPI = render(<CookiesConsent visible={true} hideModal={hideModal} />, {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
  await flushAllPromisesWithAct()
  return renderAPI
}
