import { Route } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { goBack } from '__mocks__/@react-navigation/native'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { usePreviousRoute } from 'features/navigation/helpers/usePreviousRoute'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { storage } from 'libs/storage'
import { superFlushWithAct, render, fireEvent, waitFor } from 'tests/utils'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

import { ConsentSettings } from './ConsentSettings'

jest.mock('features/navigation/helpers/openUrl')
const mockedOpenUrl = openUrl as jest.MockedFunction<typeof openUrl>

jest.mock('features/navigation/helpers/usePreviousRoute')
const mockedUsePreviousRoute = usePreviousRoute as jest.MockedFunction<typeof usePreviousRoute>

// eslint-disable-next-line local-rules/no-allow-console
allowConsole({ error: true })

describe('ConsentSettings', () => {
  beforeEach(() => {
    storage.clear('has_accepted_cookie')
  })

  it('should display inactive switch et set has_accepted_cookie to false if has_accepted_cookie is null', async () => {
    storage.saveObject('has_accepted_cookie', null)
    const { expectTrackingSwitchDisabled } = await renderConsentSettings()

    await waitFor(async () => {
      expect(await storage.readObject('has_accepted_cookie')).toBe(false)
      expectTrackingSwitchDisabled()
    })
  })

  it('should display inactive switch if user choise is false', async () => {
    storage.saveObject('has_accepted_cookie', false)
    const { expectTrackingSwitchDisabled } = await renderConsentSettings()

    await waitFor(() => {
      expectTrackingSwitchDisabled()
    })
  })

  it('should display active switch if user choise is true', async () => {
    storage.saveObject('has_accepted_cookie', true)
    const { expectTrackingSwitchEnabled } = await renderConsentSettings()

    await waitFor(() => {
      expectTrackingSwitchEnabled()
    })
  })

  it('should enable save button on toggle switch', async () => {
    const { pressTrackingSwitch, expectSaveButtonEnabled } = await renderConsentSettings()

    pressTrackingSwitch()

    await waitFor(() => {
      expectSaveButtonEnabled()
    })
  })

  it('should save user choice in storage and call setAnalyticsCollectionEnabled on press save', async () => {
    const {
      expectTrackingSwitchEnabled,
      expectSaveButtonEnabled,
      pressTrackingSwitch,
      pressSaveButton,
    } = await renderConsentSettings()

    pressTrackingSwitch()

    await waitFor(() => {
      expectTrackingSwitchEnabled()
      expectSaveButtonEnabled()
    })

    pressSaveButton()

    await waitFor(async () => {
      expect(await storage.readObject('has_accepted_cookie')).toBe(true)
      expect(analytics.enableCollection).toHaveBeenCalled()
    })
  })

  it('should go back on press save', async () => {
    const { getByTestId, getByText } = await renderConsentSettings()

    const toggleButton = getByTestId('Interrupteur données de navigation')
    fireEvent.press(toggleButton)

    await waitFor(() => {
      const saveButton = getByText('Enregistrer')
      fireEvent.press(saveButton)
      expect(goBack).toHaveBeenCalled()
    })
  })

  it('should open cookies policies on click on "Politique des cookies"', async () => {
    const { getByText } = await renderConsentSettings()

    fireEvent.press(getByText('Politique des cookies'))

    await superFlushWithAct(1)
    expect(mockedOpenUrl).toBeCalledWith(env.COOKIES_POLICY_LINK)
  })
})

const TRACKING_SWITCH_TEST_ID = 'Interrupteur données de navigation'
const SAVE_BUTTON_TEST_ID = 'Enregistrer'

async function renderConsentSettings() {
  mockedUsePreviousRoute.mockReturnValue(jest.fn() as unknown as Route<string>)

  const onGoBack = jest.fn() as () => void
  const navigationProps = {
    route: {
      params: { onGoBack },
    },
  } as StackScreenProps<RootStackParamList, 'ConsentSettings'>

  const renderAPI = render(<ConsentSettings {...navigationProps} />)
  await superFlushWithAct(1)

  function pressTrackingSwitch() {
    const trackingSwitch = renderAPI.getByTestId(TRACKING_SWITCH_TEST_ID)
    fireEvent.press(trackingSwitch)
  }

  function expectTrackingSwitchEnabled() {
    const trackingSwitch = renderAPI.getByTestId(TRACKING_SWITCH_TEST_ID)
    expect(trackingSwitch.parent?.props.accessibilityValue.text).toBe('true')
  }

  function expectTrackingSwitchDisabled() {
    const trackingSwitch = renderAPI.getByTestId(TRACKING_SWITCH_TEST_ID)
    expect(trackingSwitch.parent?.props.accessibilityValue.text).toBe('false')
  }

  function pressSaveButton() {
    const saveButton = renderAPI.getByTestId(SAVE_BUTTON_TEST_ID)
    fireEvent.press(saveButton)
  }

  function expectSaveButtonEnabled() {
    const saveButton = renderAPI.getByTestId(SAVE_BUTTON_TEST_ID)
    const background = saveButton.props.style.backgroundColor
    expect(background).toEqual(ColorsEnum.PRIMARY)
  }

  return {
    ...renderAPI,
    expectTrackingSwitchEnabled,
    expectTrackingSwitchDisabled,
    expectSaveButtonEnabled,
    pressTrackingSwitch,
    pressSaveButton,
  }
}
