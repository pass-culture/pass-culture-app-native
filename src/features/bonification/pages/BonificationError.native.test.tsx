import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { BonificationError } from 'features/bonification/pages/BonificationError'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

describe('BonificationError', () => {
  it('Should navigate to next form when pressing "Retourner vers le formulaire" when checkbox is checked', async () => {
    render(<BonificationError />)

    const button = screen.getByText('Retourner vers le formulaire')
    await userEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
      params: undefined,
      screen: 'BonificationNames',
    })
  })

  it('Should go navigate to home when pressing "Retourner à l’accueil"', async () => {
    render(<BonificationError />)

    const button = screen.getByText('Retourner à l’accueil')
    await userEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('TabNavigator', { params: undefined, screen: 'Home' })
  })
})
