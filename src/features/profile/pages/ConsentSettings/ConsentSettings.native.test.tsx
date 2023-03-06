import mockdate from 'mockdate'
import React from 'react'

import Package from '__mocks__/package.json'
import { COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import * as Tracking from 'features/cookies/helpers/startTrackingAcceptedCookies'
import { ConsentSettings } from 'features/profile/pages/ConsentSettings/ConsentSettings'
import { analytics } from 'libs/firebase/analytics'
import { storage } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

const COOKIES_CONSENT_KEY = 'cookies'
const Today = new Date(2022, 9, 29)
mockdate.set(Today)
const deviceId = 'testUuidV4'

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
    const renderAPI = renderConsentSettings()

    await screen.findAllByRole('checkbox')
    expect(renderAPI).toMatchSnapshot()
  })

  it('should persist cookies consent information when user partially accepts cookies', async () => {
    const { getByText, getByTestId } = renderConsentSettings()

    const performanceSwitch = getByTestId('Interrupteur-performance')
    fireEvent.press(performanceSwitch)

    const saveChoice = getByText('Enregistrer mes choix')
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
    const { getByText } = renderConsentSettings()

    const saveChoice = getByText('Enregistrer mes choix')
    fireEvent.press(saveChoice)

    await waitFor(() => {
      expect(mockStartTrackingAcceptedCookies).toHaveBeenCalledWith([])
    })
  })

  it('should call startTrackingAcceptedCookies with cookies performance if user accepts performance cookies', async () => {
    const { getByTestId, getByText } = renderConsentSettings()

    const performanceSwitch = getByTestId('Interrupteur-performance')
    fireEvent.press(performanceSwitch)

    const saveChoice = getByText('Enregistrer mes choix')
    fireEvent.press(saveChoice)

    await waitFor(() => {
      expect(mockStartTrackingAcceptedCookies).toHaveBeenCalledWith(COOKIES_BY_CATEGORY.performance)
    })
  })

  it('should log analytics if performance cookies are accepted', async () => {
    const { getByText, getByTestId } = renderConsentSettings()

    const performanceSwitch = getByTestId('Interrupteur-performance')
    fireEvent.press(performanceSwitch)

    const saveChoice = getByText('Enregistrer mes choix')
    fireEvent.press(saveChoice)

    await waitFor(() =>
      expect(analytics.logHasMadeAChoiceForCookies).toHaveBeenCalledWith({
        from: 'ConsentSettings',
        type: { performance: true, customization: false, marketing: false },
      })
    )
  })

  it('should show snackbar and navigate to home on save', async () => {
    const { getByText } = renderConsentSettings()

    const saveChoice = getByText('Enregistrer mes choix')
    fireEvent.press(saveChoice)

    await waitFor(() => {
      expect(mockShowSuccessSnackBar).toBeCalledWith({
        message: 'Ton choix a bien été enregistré.',
        timeout: SNACK_BAR_TIME_OUT,
      })
      expect(mockNavigate).toBeCalledWith('TabNavigator', { screen: 'Profile' })
    })
  })
})

const renderConsentSettings = () =>
  render(<ConsentSettings />, {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
