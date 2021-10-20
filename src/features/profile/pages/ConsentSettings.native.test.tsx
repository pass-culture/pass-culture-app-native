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
import { ColorsEnum } from 'ui/theme'

import { ConsentSettings } from './ConsentSettings'

jest.mock('features/navigation/helpers/openUrl')
const mockedOpenUrl = openUrl as jest.MockedFunction<typeof openUrl>

jest.mock('features/navigation/helpers/usePreviousRoute')
const mockedUsePreviousRoute = usePreviousRoute as jest.MockedFunction<typeof usePreviousRoute>

describe('ConsentSettings', () => {
  afterEach(() => {
    storage.clear('has_accepted_cookie')
  })

  it('should save has_accepted_cookie to true (default)', async () => {
    storage.saveObject('has_accepted_cookie', null)
    const { getByTestId } = renderConsentSettings()

    await waitFor(async () => {
      expect(await storage.readObject('has_accepted_cookie')).toBe(true)
      const trackingSwitch = getByTestId('Interrupteur données de navigation')
      expect(trackingSwitch.parent?.props.accessibilityValue.text).toBe('true')
    })
  })

  it('should display inactive switch if user choise is false', async () => {
    storage.saveObject('has_accepted_cookie', false)
    const { getByTestId } = renderConsentSettings()

    await waitFor(() => {
      const trackingSwitch = getByTestId('Interrupteur données de navigation')
      expect(trackingSwitch.parent?.props.accessibilityValue.text).toBe('false')
    })
  })

  it('should display active switch if user choise is true', async () => {
    storage.saveObject('has_accepted_cookie', true)
    const { getByTestId } = renderConsentSettings()

    await waitFor(() => {
      const trackingSwitch = getByTestId('Interrupteur données de navigation')
      expect(trackingSwitch.parent?.props.accessibilityValue.text).toBe('true')
    })
  })

  it('should enable save button on toggle switch', async () => {
    const { getByTestId } = renderConsentSettings()

    const toggleButton = getByTestId('Interrupteur données de navigation')
    fireEvent.press(toggleButton)

    await waitFor(() => {
      const saveButton = getByTestId('Enregistrer')
      const background = saveButton.props.style.backgroundColor
      expect(background).toEqual(ColorsEnum.PRIMARY)
    })
  })

  it('should save user choice in storage and call setAnalyticsCollectionEnabled on press save', async () => {
    const { getByTestId, getByText } = renderConsentSettings()

    const toggleButton = getByTestId('Interrupteur données de navigation')
    fireEvent.press(toggleButton)

    await waitFor(async () => {
      const saveButton = getByText('Enregistrer')
      fireEvent.press(saveButton)
      expect(await storage.readObject('has_accepted_cookie')).toBe(true)
      expect(analytics.enableCollection).toHaveBeenCalled()
    })
  })

  it('should go back on press save', async () => {
    const { getByTestId, getByText } = renderConsentSettings()

    const toggleButton = getByTestId('Interrupteur données de navigation')
    fireEvent.press(toggleButton)

    await waitFor(() => {
      const saveButton = getByText('Enregistrer')
      fireEvent.press(saveButton)
      expect(goBack).toHaveBeenCalled()
    })
  })

  it('should open cookies policies on click on "Politique des cookies"', async () => {
    const { getByText } = renderConsentSettings()

    fireEvent.press(getByText('Politique des cookies'))

    await superFlushWithAct(1)
    expect(mockedOpenUrl).toBeCalledWith(env.COOKIES_POLICY_LINK)
  })
})

function renderConsentSettings() {
  mockedUsePreviousRoute.mockReturnValue((jest.fn() as unknown) as Route<string>)

  const onGoBack = jest.fn() as () => void
  const navigationProps = {
    route: {
      params: { onGoBack },
    },
  } as StackScreenProps<RootStackParamList, 'ConsentSettings'>
  return render(<ConsentSettings {...navigationProps} />)
}
