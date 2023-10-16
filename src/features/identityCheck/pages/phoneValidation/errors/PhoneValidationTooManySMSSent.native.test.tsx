import mockdate from 'mockdate'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { usePhoneValidationRemainingAttempts } from 'features/identityCheck/api/usePhoneValidationRemainingAttempts'
import { PhoneValidationTooManySMSSent } from 'features/identityCheck/pages/phoneValidation/errors/PhoneValidationTooManySMSSent'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { fireEvent, render, screen } from 'tests/utils'

jest.mock('features/navigation/helpers')
jest.mock('features/navigation/navigationRef')

jest.mock('features/identityCheck/api/usePhoneValidationRemainingAttempts', () => {
  return {
    usePhoneValidationRemainingAttempts: jest.fn().mockReturnValue({
      remainingAttempts: 0,
      counterResetDatetime: '2022-07-08T13:30:00Z',
      isLastAttempt: false,
    }),
  }
})

const mockedPhoneValidationRemainingAttempts = jest.mocked(usePhoneValidationRemainingAttempts)

describe('PhoneValidationTooManySMSSent', () => {
  beforeAll(() => {
    mockdate.set(new Date('2022-07-08T13:00:00Z'))
  })
  it('should display "1 heure" in description', async () => {
    renderPhoneValidationTooManySMSSent()
    expect(screen.getByText('Tu pourras réessayer dans 1 heure.')).toBeOnTheScreen()
  })
  it('should display "2 heures" in description', async () => {
    mockedPhoneValidationRemainingAttempts.mockReturnValueOnce({
      remainingAttempts: 0,
      counterResetDatetime: '2022-07-08T19:30:00Z',
      isLastAttempt: false,
    })
    renderPhoneValidationTooManySMSSent()
    expect(screen.getByText('Tu pourras réessayer dans 7 heures.')).toBeOnTheScreen()
  })
  it('should redirect to Home when clicking on homepage button', async () => {
    renderPhoneValidationTooManySMSSent()

    fireEvent.press(screen.getByText('Retourner à l’accueil'))

    expect(navigateFromRef).toBeCalledWith(navigateToHomeConfig.screen, navigateToHomeConfig.params)
  })
  it('should redirect to SetPhoneValidationCode when clicking on second button', async () => {
    renderPhoneValidationTooManySMSSent()

    fireEvent.press(screen.getByText('J’ai reçu mon code'))

    expect(navigate).toBeCalledWith('SetPhoneValidationCode', undefined)
  })
})

function renderPhoneValidationTooManySMSSent() {
  return render(<PhoneValidationTooManySMSSent />)
}
