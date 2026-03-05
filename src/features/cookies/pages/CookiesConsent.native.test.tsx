import { RouteProp } from '@react-navigation/native'
import mockdate from 'mockdate'
import React from 'react'

import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { ConsentState } from 'features/cookies/enums'
import * as SetMarketingParams from 'features/cookies/helpers/setMarketingParams'
import * as useCookiesModule from 'features/cookies/helpers/useCookies'
import { CookiesConsent } from 'features/cookies/pages/CookiesConsent'
import { navigationRef } from 'features/navigation/navigationRef'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { EmptyResponse } from 'libs/fetch'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { storage } from 'libs/storage'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

const setCookiesConsentMock = jest.fn()
jest.spyOn(useCookiesModule, 'useCookies').mockReturnValue({
  setCookiesConsent: setCookiesConsentMock,
  cookiesConsent: {
    state: ConsentState.LOADING,
  },
  setUserId: jest.fn(),
  loadCookiesConsent: jest.fn(),
})

jest.mock('libs/react-native-device-info/getDeviceId')

const COOKIES_CONSENT_KEY = 'cookies'
const hideModal = jest.fn()
const Today = new Date(2022, 9, 29)
mockdate.set(Today)

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: jest.fn(), push: jest.fn() }),
  useFocusEffect: jest.fn(),
}))

jest.mock('features/navigation/navigationRef')

const UTM_PARAMS = {
  utm_campaign: 'test',
  utm_medium: 'test',
  utm_source: 'test',
}

const mockRoute: RouteProp<RootStackParamList, 'UTMParameters'> = {
  params: UTM_PARAMS,
  key: 'UTMParameters',
  name: 'UTMParameters',
}

jest.spyOn(navigationRef, 'getCurrentRoute').mockReturnValue(mockRoute)

const setMarketingParamsSpy = jest.spyOn(SetMarketingParams, 'setMarketingParams')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

jest.mock('ui/components/anchor/AnchorContext', () => ({
  useScrollToAnchor: jest.fn,
  useRegisterAnchor: jest.fn,
}))

const CUSTOMIZE_NAVIGATION_SWITCH = /Personnaliser ta navigation - Interrupteur à bascule/
const NAVIGATION_STATISTICS_SWITCH =
  /Enregistrer des statistiques de navigation - Interrupteur à bascule/

const user = userEvent.setup()

jest.useFakeTimers()

describe('<CookiesConsent/>', () => {
  beforeEach(async () => {
    await storage.clear(COOKIES_CONSENT_KEY)
    mockServer.postApi<EmptyResponse>('/v1/cookies_consent', {})
    mockdate.set(Today)
    setFeatureFlags()
  })

  it('should render correctly', async () => {
    renderCookiesConsent()

    await screen.findByText('Tout accepter')

    expect(screen).toMatchSnapshot()
  })

  describe('accept all cookies', () => {
    it('should persist cookies consent information', async () => {
      renderCookiesConsent()

      await user.press(screen.getByText('Tout accepter'))

      expect(setCookiesConsentMock).toHaveBeenCalledWith({
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: ALL_OPTIONAL_COOKIES,
        refused: [],
      })
    })

    it('should log analytics', async () => {
      renderCookiesConsent()

      await user.press(screen.getByText('Tout accepter'))

      expect(analytics.logHasAcceptedAllCookies).toHaveBeenCalledTimes(1)
    })

    it('should hide modal', async () => {
      renderCookiesConsent()

      await user.press(screen.getByText('Tout accepter'))

      expect(hideModal).toHaveBeenCalledTimes(1)
    })
  })

  describe('refuse all cookies', () => {
    it('should persist cookies consent information', async () => {
      renderCookiesConsent()

      await user.press(screen.getByText('Tout refuser'))

      expect(setCookiesConsentMock).toHaveBeenCalledWith({
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: [],
        refused: ALL_OPTIONAL_COOKIES,
      })
    })

    it('should not set marketing params', async () => {
      renderCookiesConsent()

      await user.press(screen.getByText('Tout refuser'))

      expect(setMarketingParamsSpy).not.toHaveBeenCalled()
    })

    it('should hide modal', async () => {
      renderCookiesConsent()

      await user.press(screen.getByText('Tout refuser'))

      expect(hideModal).toHaveBeenCalledTimes(1)
    })
  })

  describe('make detailled cookie choice', () => {
    it('should persist cookies consent information when user partially accepts cookies', async () => {
      renderCookiesConsent()

      await user.press(screen.getByText('Choisir les cookies'))

      await user.press(screen.getByTestId(NAVIGATION_STATISTICS_SWITCH))

      await user.press(screen.getByText('Enregistrer mes choix'))

      expect(setCookiesConsentMock).toHaveBeenCalledWith({
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: COOKIES_BY_CATEGORY.performance,
        refused: [
          ...COOKIES_BY_CATEGORY.customization,
          ...COOKIES_BY_CATEGORY.marketing,
          ...COOKIES_BY_CATEGORY.video,
        ],
      })
    })

    it('should log analytics if performance cookies are accepted', async () => {
      renderCookiesConsent()

      await user.press(screen.getByText('Choisir les cookies'))

      await user.press(screen.getByTestId(NAVIGATION_STATISTICS_SWITCH))

      await user.press(screen.getByText('Enregistrer mes choix'))

      expect(analytics.logHasMadeAChoiceForCookies).toHaveBeenCalledWith({
        from: 'Modal',
        type: { performance: true, customization: false, marketing: false, video: false },
      })
    })

    it('should call setMarketingParams with empty array when all cookies are refused', async () => {
      renderCookiesConsent()

      await user.press(screen.getByText('Choisir les cookies'))

      await user.press(screen.getByText('Enregistrer mes choix'))

      expect(setMarketingParamsSpy).toHaveBeenNthCalledWith(1, UTM_PARAMS, [])
    })

    it('should call setMarketingParams with customization cookies when they are accepted', async () => {
      renderCookiesConsent()

      await user.press(screen.getByText('Choisir les cookies'))

      await user.press(screen.getByTestId(CUSTOMIZE_NAVIGATION_SWITCH))

      await user.press(screen.getByText('Enregistrer mes choix'))

      expect(setMarketingParamsSpy).toHaveBeenNthCalledWith(
        1,
        UTM_PARAMS,
        COOKIES_BY_CATEGORY.customization
      )
    })

    it('should hide modale when user saves cookies choice', async () => {
      renderCookiesConsent()

      await user.press(screen.getByText('Choisir les cookies'))

      await user.press(screen.getByText('Enregistrer mes choix'))

      expect(hideModal).toHaveBeenCalledTimes(1)
    })
  })
})

const renderCookiesConsent = () => {
  render(<CookiesConsent visible hideModal={hideModal} />, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
