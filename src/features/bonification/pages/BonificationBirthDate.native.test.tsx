import React from 'react'

import { goBack, navigate } from '__mocks__/@react-navigation/native'
import { ELIGIBLE_AGE_DATE } from 'features/auth/fixtures/fixtures'
import { BonificationBirthDate } from 'features/bonification/pages/BonificationBirthDate'
import { legalRepresentativeActions } from 'features/bonification/store/legalRepresentativeStore'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { act, fireEvent, render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')
jest.mock('libs/firebase/analytics/analytics')

describe('BonificationBirthDate', () => {
  it('should navigate to next form when pressing "Continuer" when forms are filled', async () => {
    render(<BonificationBirthDate />)

    const datePicker = screen.getByTestId('date-picker-spinner-native')
    await act(() =>
      fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })
    )

    const button = screen.getByText('Continuer')
    await userEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
      params: undefined,
      screen: 'BonificationBirthPlace',
    })
  })

  it('should navigate to FAQ if button pressed', async () => {
    render(<BonificationBirthDate />)

    const button = screen.getByText('Je ne connais pas sa date de naissance')
    await userEvent.press(button)

    expect(openUrl).toHaveBeenCalledWith(
      'https://aide.passculture.app/hc/fr/articles/24338766387100-FAQ-Bonif'
    )
  })

  it('should go back when pressing go back button', async () => {
    render(<BonificationBirthDate />)

    const button = screen.getByLabelText('Revenir en arrière')
    await userEvent.press(button)

    expect(goBack).toHaveBeenCalledTimes(1)
  })

  describe('Data persistence', () => {
    beforeEach(() => {
      const { resetLegalRepresentative } = legalRepresentativeActions
      resetLegalRepresentative()
    })

    it('should show previously saved data if there is any', () => {
      const { setBirthDate } = legalRepresentativeActions
      const birthDate = '1975-10-10T00:00:00.000Z'
      setBirthDate(new Date(birthDate))
      render(<BonificationBirthDate />)

      const datePicker = screen.getByTestId('date-picker-spinner-native')

      expect(datePicker.props.date).toBe(birthDate)
    })

    it('should save form to store when pressing "Continuer"', async () => {
      const setBirthDateSpy = jest.spyOn(legalRepresentativeActions, 'setBirthDate')

      render(<BonificationBirthDate />)

      const datePicker = screen.getByTestId('date-picker-spinner-native')
      await act(() =>
        fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })
      )

      const button = screen.getByText('Continuer')
      await userEvent.press(button)

      expect(setBirthDateSpy).toHaveBeenCalledWith(new Date('2003-12-01T00:00:00.000Z'))
    })
  })
})
