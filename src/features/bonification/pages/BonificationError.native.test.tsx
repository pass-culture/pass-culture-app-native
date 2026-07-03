import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { BonificationType } from 'features/bonification/enums'
import { BonificationError } from 'features/bonification/pages/BonificationError'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

describe('BonificationError', () => {
  describe('Family quotient bonification', () => {
    it('should navigate to bonification name when pressing "Revenir vers le formulaire" when checkbox is checked', async () => {
      useRoute.mockReturnValueOnce({
        params: { bonificationType: BonificationType.FAMILY_QUOTIENT },
      })
      render(<BonificationError />)

      const button = screen.getByText('Revenir vers le formulaire')
      await userEvent.press(button)

      expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
        params: undefined,
        screen: 'BonificationNames',
      })
    })
  })

  describe('Disability bonification', () => {
    it('should navigate to bonification birth place when pressing "Revenir vers le formulaire" when checkbox is checked', async () => {
      useRoute.mockReturnValueOnce({ params: { bonificationType: BonificationType.DISABILITY } })
      render(<BonificationError />)

      const button = screen.getByText('Revenir vers le formulaire')
      await userEvent.press(button)

      expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
        params: { bonificationType: BonificationType.DISABILITY },
        screen: 'BonificationBirthPlace',
      })
    })
  })

  it('should navigate to home when pressing "Revenir au catalogue"', async () => {
    render(<BonificationError />)

    const button = screen.getByText('Revenir au catalogue')
    await userEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('TabNavigator', { params: undefined, screen: 'Home' })
  })
})
