import React from 'react'

import { goBack, navigate } from '__mocks__/@react-navigation/native'
import { ELIGIBLE_AGE_DATE } from 'features/auth/fixtures/fixtures'
import { BonificationBirthDate } from 'features/bonification/pages/BonificationBirthDate'
import { act, fireEvent, render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

describe('BonificationBirthDate', () => {
  it('Should navigate to next form when pressing "Continuer" when forms are filled', async () => {
    render(<BonificationBirthDate />)

    const datePicker = screen.getByTestId('date-picker-spinner-native')
    await act(() =>
      fireEvent(datePicker, 'onChange', { nativeEvent: { timestamp: ELIGIBLE_AGE_DATE } })
    )

    const button = screen.getByText('Continuer')
    await userEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('BonificationBirthPlace')
  })

  it('Should go back when pressing go back button', async () => {
    render(<BonificationBirthDate />)

    const button = screen.getByLabelText('Revenir en arrière')
    await userEvent.press(button)

    expect(goBack).toHaveBeenCalledTimes(1)
  })
})
