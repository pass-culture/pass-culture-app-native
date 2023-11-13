import mockdate from 'mockdate'
import React from 'react'

import Package from '__mocks__/package.json'
import { COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import * as Tracking from 'features/cookies/helpers/startTrackingAcceptedCookies'
import { ConsentSettings } from 'features/profile/pages/ConsentSettings/ConsentSettings'
import { analytics } from 'libs/analytics'
import { storage } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

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

describe('<ConsentSettings/>', () => {
  it('should render correctly', async () => {
    renderConsentSettings()

    await screen.findByTestId('Interrupteur Tout accepter')

    expect(screen).toMatchSnapshot()
  })

  it('should persist cookies consent information when user partially accepts cookies', async () => {
    renderConsentSettings()

    const performanceSwitch = screen.getByTestId(
      'Interrupteur Enregistrer des statistiques de navigation'
    )
    fireEvent.press(performanceSwitch)

    const saveChoice = screen.getByText('Enregistrer mes choix')
    fireEvent.press(saveChoice)

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
    await waitFor(async () => {
      expect(await storage.readObject(COOKIES_CONSENT_KEY)).toEqual(storageContent)
    })
  })

  it('should call startTrackingAcceptedCookies with empty array if user refuses all cookies', async () => {
    renderConsentSettings()

    const saveChoice = screen.getByText('Enregistrer mes choix')
    await act(async () => {
      fireEvent.press(saveChoice)
    })

    expect(mockStartTrackingAcceptedCookies).toHaveBeenCalledWith([])
  })

  it('should call startTrackingAcceptedCookies with cookies performance if user accepts performance cookies', async () => {
    renderConsentSettings()

    const performanceSwitch = screen.getByTestId(
      'Interrupteur Enregistrer des statistiques de navigation'
    )
    await act(async () => {
      fireEvent.press(performanceSwitch)
    })

    const saveChoice = screen.getByText('Enregistrer mes choix')
    await act(async () => {
      fireEvent.press(saveChoice)
    })

    expect(mockStartTrackingAcceptedCookies).toHaveBeenCalledWith(COOKIES_BY_CATEGORY.performance)
  })

  it('should log analytics if performance cookies are accepted', async () => {
    renderConsentSettings()

    const performanceSwitch = screen.getByTestId(
      'Interrupteur Enregistrer des statistiques de navigation'
    )
    await act(async () => {
      fireEvent.press(performanceSwitch)
    })

    const saveChoice = screen.getByText('Enregistrer mes choix')
    await act(async () => {
      fireEvent.press(saveChoice)
    })

    expect(analytics.logHasMadeAChoiceForCookies).toHaveBeenCalledWith({
      from: 'ConsentSettings',
      type: { performance: true, customization: false, marketing: false },
    })
  })

  it('should show snackbar and navigate to home on save', async () => {
    renderConsentSettings()

    const saveChoice = screen.getByText('Enregistrer mes choix')
    await act(async () => {
      fireEvent.press(saveChoice)
    })

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
