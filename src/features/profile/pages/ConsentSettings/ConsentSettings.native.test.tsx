import mockdate from 'mockdate'
import React from 'react'

import { COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { ConsentState } from 'features/cookies/enums'
import * as Tracking from 'features/cookies/helpers/startTrackingAcceptedCookies'
import * as useCookies from 'features/cookies/helpers/useCookies'
import type * as CookiesTypes from 'features/cookies/types'
import { ConsentStatus } from 'features/cookies/types'
import * as useGoBack from 'features/navigation/useGoBack'
import { ConsentSettings } from 'features/profile/pages/ConsentSettings/ConsentSettings'
import { analytics } from 'libs/analytics/provider'
import { EmptyResponse } from 'libs/fetch'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import * as PackageJson from 'libs/packageJson'
import { storage } from 'libs/storage'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'
import * as useModalAPI from 'ui/components/modals/useModal'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

jest.mock('libs/campaign/campaign')
jest.mock('libs/react-native-device-info/getDeviceId')
const buildVersion = 10010005
jest.spyOn(PackageJson, 'getAppBuildVersion').mockReturnValue(buildVersion)

const COOKIES_CONSENT_KEY = 'cookies'
const Today = new Date(2022, 9, 29)
mockdate.set(Today)
const deviceId = 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a'

const mockNavigate = jest.fn()
const mockDispatch = jest.fn()

let mockRouteParams = {}
let beforeRemoveHandler
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
    push: jest.fn(),
    goBack: jest.fn(),
    dispatch: mockDispatch,
    addListener: jest.fn((event: string, cb) => {
      if (event === 'beforeRemove') beforeRemoveHandler = cb
      return jest.fn()
    }),
  }),
  useFocusEffect: jest.fn(),
  useRoute: () => ({ params: mockRouteParams }),
  usePreventRemoveContext: () => ({ setPreventRemove: jest.fn() }),
}))

const mockStartTrackingAcceptedCookies = jest.spyOn(Tracking, 'startTrackingAcceptedCookies')

const mockShowSuccessSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowSuccessSnackBar(props)),
  }),
}))

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

jest.mock('react-native/Libraries/Interaction/InteractionManager', () => ({
  ...jest.requireActual('react-native/Libraries/Interaction/InteractionManager'),
  runAfterInteractions: jest.fn((callback) => callback()), // Exécute le callback immédiatement
  createInteractionHandle: jest.fn(() => 1),
  clearInteractionHandle: jest.fn(),
  setDeadline: jest.fn(),
}))

const refusedDefault = [
  ...COOKIES_BY_CATEGORY.marketing,
  ...COOKIES_BY_CATEGORY.customization,
  ...COOKIES_BY_CATEGORY.video,
]

const cookiesConsentStable: ConsentStatus = {
  state: ConsentState.HAS_CONSENT,
  value: {
    mandatory: COOKIES_BY_CATEGORY.essential,
    accepted: [],
    refused: refusedDefault,
  },
}

const setCookiesConsentMock = jest.fn(async (consent) => {
  await storage.saveObject(COOKIES_CONSENT_KEY, {
    buildVersion,
    deviceId,
    choiceDatetime: Today.toISOString(),
    consent,
  })
})

const useCookiesMockStable = {
  cookiesConsent: cookiesConsentStable,
  setCookiesConsent: setCookiesConsentMock,
  setUserId: jest.fn(),
  loadCookiesConsent: jest.fn(),
}

const useCookiesSpyOn = jest.spyOn(useCookies, 'useCookies').mockReturnValue(useCookiesMockStable)

const mockShowModal = jest.fn()
const useModalSpy = jest.spyOn(useModalAPI, 'useModal').mockReturnValue({
  visible: false,
  showModal: mockShowModal,
  hideModal: jest.fn(),
  toggleModal: jest.fn(),
})

const ACCEPT_ALL_SWITCH = /Tout accepter - Interrupteur à bascule/
const BROWSING_STATISTICS_SWITCH =
  /Enregistrer des statistiques de navigation - Interrupteur à bascule/

const user = userEvent.setup()

jest.useFakeTimers()

describe('<ConsentSettings/>', () => {
  beforeEach(() => {
    mockdate.set(Today)
    setFeatureFlags()
    mockGoBack.mockClear()
    mockDispatch.mockClear()
  })

  it('should render correctly', async () => {
    renderConsentSettings()

    await screen.findByTestId(ACCEPT_ALL_SWITCH)

    expect(screen).toMatchSnapshot()
  })

  it('should persist cookies consent information when user partially accepts cookies', async () => {
    mockServer.postApi<EmptyResponse>('/v1/cookies_consent', {})

    renderConsentSettings()

    const performanceSwitch = screen.getByTestId(BROWSING_STATISTICS_SWITCH)
    await user.press(performanceSwitch)

    const saveChoice = screen.getByText('Enregistrer mes choix')
    await user.press(saveChoice)

    const storageContent = {
      buildVersion,
      deviceId,
      choiceDatetime: Today.toISOString(),
      consent: {
        mandatory: COOKIES_BY_CATEGORY.essential,
        accepted: COOKIES_BY_CATEGORY.performance,
        refused: [
          ...COOKIES_BY_CATEGORY.marketing,
          ...COOKIES_BY_CATEGORY.customization,
          ...COOKIES_BY_CATEGORY.video,
        ],
      },
    }

    expect(await storage.readObject(COOKIES_CONSENT_KEY)).toEqual(storageContent)
  })

  it('should call startTrackingAcceptedCookies with empty array if user refuses all cookies', async () => {
    mockServer.postApi<EmptyResponse>('/v1/cookies_consent', {})

    const emptyCookies: CookiesTypes.Cookies = []
    const consentValue: CookiesTypes.Consent = {
      mandatory: emptyCookies,
      accepted: emptyCookies,
      refused: emptyCookies,
    }
    const consentStatus: CookiesTypes.ConsentStatus = {
      state: ConsentState.HAS_CONSENT,
      value: consentValue,
    }

    useCookiesSpyOn.mockReturnValueOnce({
      cookiesConsent: consentStatus,
      setCookiesConsent: jest.fn(),
      setUserId: jest.fn(),
      loadCookiesConsent: jest.fn(),
    })

    renderConsentSettings()

    const saveChoice = screen.getByText('Enregistrer mes choix')
    await user.press(saveChoice)

    expect(mockStartTrackingAcceptedCookies).toHaveBeenCalledWith([])
  })

  it('should call startTrackingAcceptedCookies with cookies performance if user accepts performance cookies', async () => {
    mockServer.postApi<EmptyResponse>('/v1/cookies_consent', {})

    renderConsentSettings()

    const performanceSwitch = screen.getByTestId(BROWSING_STATISTICS_SWITCH)
    await user.press(performanceSwitch)

    const saveChoice = screen.getByText('Enregistrer mes choix')
    await user.press(saveChoice)

    expect(mockStartTrackingAcceptedCookies).toHaveBeenCalledWith(COOKIES_BY_CATEGORY.performance)
  })

  it('should log analytics if performance cookies are accepted', async () => {
    mockServer.postApi<EmptyResponse>('/v1/cookies_consent', {})

    renderConsentSettings()

    const performanceSwitch = screen.getByTestId(BROWSING_STATISTICS_SWITCH)
    await user.press(performanceSwitch)

    const saveChoice = screen.getByText('Enregistrer mes choix')
    await user.press(saveChoice)

    expect(analytics.logHasMadeAChoiceForCookies).toHaveBeenCalledWith({
      from: 'ConsentSettings',
      type: { performance: true, customization: false, marketing: false, video: false },
    })
  })

  it('should show snackbar and navigate to home on save', async () => {
    mockServer.postApi<EmptyResponse>('/v1/cookies_consent', {})

    renderConsentSettings()

    const saveChoice = screen.getByText('Enregistrer mes choix')
    await user.press(saveChoice)

    expect(mockShowSuccessSnackBar).toHaveBeenCalledWith({
      message: 'Ton choix a bien été enregistré.',
      timeout: SNACK_BAR_TIME_OUT,
    })
    expect(mockNavigate).toHaveBeenCalledWith('TabNavigator', { screen: 'Profile' })
  })

  it('should opens confirm modal on beforeRemove when there are unsaved changes', async () => {
    renderConsentSettings()

    await user.press(await screen.findByTestId(BROWSING_STATISTICS_SWITCH))

    const preventDefault = jest.fn()
    beforeRemoveHandler({ data: { action: { type: 'GO_BACK' } }, preventDefault })

    expect(preventDefault).toHaveBeenCalledWith()
    expect(mockShowModal).toHaveBeenCalledTimes(1)
  })

  it('should discard without pending action: bypass guard once and go back', async () => {
    useModalSpy.mockReturnValueOnce({
      visible: true,
      showModal: mockShowModal,
      hideModal: jest.fn(),
      toggleModal: jest.fn(),
    })

    renderConsentSettings()

    await user.press(screen.getByText('Quitter sans enregistrer'))

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('should discard with pending action: re-dispatches intercepted action (swipe/back)', async () => {
    useModalSpy.mockReturnValueOnce({
      visible: true,
      showModal: jest.fn(),
      hideModal: jest.fn(),
      toggleModal: jest.fn(),
    })

    renderConsentSettings()

    await user.press(await screen.findByTestId(BROWSING_STATISTICS_SWITCH))

    const pendingAction = { type: 'GO_BACK' }
    const preventDefault = jest.fn()
    beforeRemoveHandler({ data: { action: pendingAction }, preventDefault })

    await user.press(screen.getByText('Quitter sans enregistrer'))

    expect(mockDispatch).toHaveBeenCalledWith(pendingAction)
  })

  it('save with offerId: navigates to Offer and shows snackbar', async () => {
    mockServer.postApi<EmptyResponse>('/v1/cookies_consent', {})

    mockRouteParams = { offerId: 116656 }

    renderConsentSettings()

    await user.press(screen.getByText('Enregistrer mes choix'))

    expect(mockNavigate).toHaveBeenCalledWith('Offer', { id: 116656 })
    expect(mockShowSuccessSnackBar).toHaveBeenCalledWith({
      message: 'Ton choix a bien été enregistré.',
      timeout: SNACK_BAR_TIME_OUT,
    })
  })

  it('beforeRemove without changes: does not prevent or open modal', async () => {
    renderConsentSettings()

    const preventDefault = jest.fn()
    beforeRemoveHandler({ data: { action: { type: 'GO_BACK' } }, preventDefault })

    expect(preventDefault).not.toHaveBeenCalled()
    expect(mockShowModal).not.toHaveBeenCalled()
  })
})

const renderConsentSettings = () =>
  render(<ConsentSettings />, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
