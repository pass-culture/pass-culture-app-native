import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { BonificationError } from 'features/bonification/pages/BonificationError'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

describe('BonificationError', () => {
  it('Should navigate to next form when pressing "Revenir vers le formulaire" when checkbox is checked', async () => {
    render(<BonificationError />)

    const button = screen.getByText('Revenir vers le formulaire')
    await userEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
      params: undefined,
      screen: 'BonificationNames',
    })
  })

  it('Should go navigate to home when pressing "Revenir au catalogue"', async () => {
    render(<BonificationError />)

    const button = screen.getByText('Revenir au catalogue')
    await userEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('TabNavigator', { params: undefined, screen: 'Home' })
  })
})
