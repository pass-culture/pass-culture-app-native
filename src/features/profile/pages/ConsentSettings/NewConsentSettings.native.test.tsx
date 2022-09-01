import mockdate from 'mockdate'
import React from 'react'

import { COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { NewConsentSettings } from 'features/profile/pages/ConsentSettings/NewConsentSettings'
import { storage } from 'libs/storage'
import { fireEvent, render, waitFor } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

const COOKIES_CONSENT_KEY = 'cookies_consent'
const Today = new Date(2022, 9, 29)
mockdate.set(Today)
const deviceId = 'testUuidV4'

const mockNavigate = jest.fn()
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate, push: jest.fn() }),
  useFocusEffect: jest.fn(),
}))

const mockShowSuccessSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowSuccessSnackBar(props)),
  }),
}))

describe('<NewConsentSettings/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<NewConsentSettings />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should save cookies consent information in storage when user partially accepts cookies', async () => {
    const { getByText, getByTestId } = render(<NewConsentSettings />)

    const performanceSwitch = getByTestId('Interrupteur-performance')
    fireEvent.press(performanceSwitch)

    const saveChoice = getByText('Enregistrer mes choix')
    fireEvent.press(saveChoice)

    await waitFor(async () =>
      expect(await storage.readObject(COOKIES_CONSENT_KEY)).toEqual({
        deviceId,
        choiceDatetime: Today.toISOString(),
        consent: {
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: COOKIES_BY_CATEGORY.performance,
          refused: [...COOKIES_BY_CATEGORY.customization, ...COOKIES_BY_CATEGORY.marketing],
        },
      })
    )
  })

  it('should save cookies consent information in storage when user partially accepts cookies', async () => {
    const { getByText } = render(<NewConsentSettings />)

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
