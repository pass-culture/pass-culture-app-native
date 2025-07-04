import mockdate from 'mockdate'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { PhoneValidationTooManySMSSent } from 'features/identityCheck/pages/phoneValidation/errors/PhoneValidationTooManySMSSent'
import { usePhoneValidationRemainingAttemptsQuery } from 'features/identityCheck/queries/usePhoneValidationRemainingAttemptsQuery'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { userEvent, render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('features/navigation/navigationRef')

jest.mock('features/identityCheck/queries/usePhoneValidationRemainingAttemptsQuery', () => {
  return {
    usePhoneValidationRemainingAttemptsQuery: jest.fn().mockReturnValue({
      remainingAttempts: 0,
      counterResetDatetime: '2022-07-08T13:30:00Z',
      isLastAttempt: false,
    }),
  }
})

const mockedPhoneValidationRemainingAttempts = jest.mocked(usePhoneValidationRemainingAttemptsQuery)

jest.useFakeTimers()

describe('PhoneValidationTooManySMSSent', () => {
  beforeAll(() => {
    mockdate.set(new Date('2022-07-08T13:00:00Z'))
  })

  it('should render correctly', () => {
    renderPhoneValidationTooManySMSSent()

    expect(screen).toMatchSnapshot()
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

    await userEvent.press(screen.getByText('Retourner à l’accueil'))

    expect(navigateFromRef).toHaveBeenCalledWith(
      navigateToHomeConfig.screen,
      navigateToHomeConfig.params
    )
  })

  it('should redirect to SetPhoneValidationCode when clicking on second button', async () => {
    renderPhoneValidationTooManySMSSent()

    await userEvent.press(screen.getByText('J’ai reçu mon code'))

    expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
      params: undefined,
      screen: 'SetPhoneValidationCode',
    })
  })
})

function renderPhoneValidationTooManySMSSent() {
  return render(<PhoneValidationTooManySMSSent />)
}
