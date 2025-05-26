import mockdate from 'mockdate'
import React from 'react'

import { COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import * as Tracking from 'features/cookies/helpers/startTrackingAcceptedCookies'
import * as useGoBack from 'features/navigation/useGoBack'
import { ConsentSettings } from 'features/profile/pages/ConsentSettings/ConsentSettings'
import { analytics } from 'libs/analytics/provider'
import { EmptyResponse } from 'libs/fetch'
import * as PackageJson from 'libs/packageJson'
import { storage } from 'libs/storage'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

jest.mock('libs/campaign')
jest.mock('libs/react-native-device-info/getDeviceId')
const buildVersion = 10010005
jest.spyOn(PackageJson, 'getAppBuildVersion').mockReturnValue(buildVersion)

const COOKIES_CONSENT_KEY = 'cookies'
const Today = new Date(2022, 9, 29)
mockdate.set(Today)
const deviceId = 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a'

const mockNavigate = jest.fn()
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate, push: jest.fn() }),
  useFocusEffect: jest.fn(),
}))

const mockStartTrackingAcceptedCookies = jest.spyOn(Tracking, 'startTrackingAcceptedCookies')

const mockShowSuccessSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowSuccessSnackBar(props)),
  }),
}))

jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: jest.fn(),
  canGoBack: jest.fn(() => true),
})

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()

jest.useFakeTimers()

describe('<ConsentSettings/>', () => {
  beforeEach(() => {
    mockdate.set(Today)
  })

  it('should render correctly', async () => {
    renderConsentSettings()

    await screen.findByTestId('Interrupteur Tout accepter')

    expect(screen).toMatchSnapshot()
  })

  it('should persist cookies consent information when user partially accepts cookies', async () => {
    mockServer.postApi<EmptyResponse>('/v1/cookies_consent', {})

    renderConsentSettings()

    const performanceSwitch = screen.getByTestId(
      'Interrupteur Enregistrer des statistiques de navigation'
    )
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
        refused: [...COOKIES_BY_CATEGORY.customization, ...COOKIES_BY_CATEGORY.marketing],
      },
    }

    expect(await storage.readObject(COOKIES_CONSENT_KEY)).toEqual(storageContent)
  })

  it('should call startTrackingAcceptedCookies with empty array if user refuses all cookies', async () => {
    mockServer.postApi<EmptyResponse>('/v1/cookies_consent', {})

    renderConsentSettings()

    const saveChoice = screen.getByText('Enregistrer mes choix')
    await user.press(saveChoice)

    expect(mockStartTrackingAcceptedCookies).toHaveBeenCalledWith([])
  })

  it('should call startTrackingAcceptedCookies with cookies performance if user accepts performance cookies', async () => {
    mockServer.postApi<EmptyResponse>('/v1/cookies_consent', {})

    renderConsentSettings()

    const performanceSwitch = screen.getByTestId(
      'Interrupteur Enregistrer des statistiques de navigation'
    )
    await user.press(performanceSwitch)

    const saveChoice = screen.getByText('Enregistrer mes choix')
    await user.press(saveChoice)

    expect(mockStartTrackingAcceptedCookies).toHaveBeenCalledWith(COOKIES_BY_CATEGORY.performance)
  })

  it('should log analytics if performance cookies are accepted', async () => {
    mockServer.postApi<EmptyResponse>('/v1/cookies_consent', {})

    renderConsentSettings()

    const performanceSwitch = screen.getByTestId(
      'Interrupteur Enregistrer des statistiques de navigation'
    )
    await user.press(performanceSwitch)

    const saveChoice = screen.getByText('Enregistrer mes choix')
    await user.press(saveChoice)

    expect(analytics.logHasMadeAChoiceForCookies).toHaveBeenCalledWith({
      from: 'ConsentSettings',
      type: { performance: true, customization: false, marketing: false },
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
})

const renderConsentSettings = () =>
  render(<ConsentSettings />, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
