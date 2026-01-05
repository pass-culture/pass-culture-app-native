import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import {
  BonificationRefused,
  BonificationRefusedType,
  PAGE_CONFIG,
} from 'features/bonification/pages/BonificationRefused'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

describe('BonificationRefused', () => {
  describe('Parent not found', () => {
    it('should go navigate to home when pressing "Corriger les informations"', async () => {
      useRoute.mockReturnValueOnce({
        params: { bonificationRefusedType: BonificationRefusedType.CUSTODIAN_NOT_FOUND },
      })
      render(<BonificationRefused />)

      const button = screen.getByText(
        PAGE_CONFIG[BonificationRefusedType.CUSTODIAN_NOT_FOUND].primaryButton.wording
      )
      await userEvent.press(button)

      expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
        params: undefined,
        screen: 'BonificationExplanations',
      })
    })
  })

  describe('Too many retries', () => {
    it('should go navigate to home when pressing "Revenir à l’accueil"', async () => {
      useRoute.mockReturnValueOnce({
        params: { bonificationRefusedType: BonificationRefusedType.TOO_MANY_RETRIES },
      })
      render(<BonificationRefused />)

      const button = screen.getByText(
        PAGE_CONFIG[BonificationRefusedType.TOO_MANY_RETRIES].primaryButton.wording
      )
      await userEvent.press(button)

      expect(navigate).toHaveBeenCalledWith('TabNavigator', { params: undefined, screen: 'Home' })
    })
  })

  describe('Child not found', () => {
    it('should go navigate to home when pressing "Renouveler ma demande"', async () => {
      useRoute.mockReturnValueOnce({
        params: { bonificationRefusedType: BonificationRefusedType.NOT_IN_TAX_HOUSEHOLD },
      })
      render(<BonificationRefused />)

      const button = screen.getByText(
        PAGE_CONFIG[BonificationRefusedType.NOT_IN_TAX_HOUSEHOLD].primaryButton.wording
      )
      await userEvent.press(button)

      expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
        params: undefined,
        screen: 'BonificationExplanations',
      })
    })
  })

  describe('Family quotient too high', () => {
    it('should go navigate to home when pressing "Revenir vers le catalogue"', async () => {
      useRoute.mockReturnValueOnce({
        params: { bonificationRefusedType: BonificationRefusedType.QUOTIENT_FAMILY_TOO_HIGH },
      })
      render(<BonificationRefused />)

      const button = screen.getByText(
        PAGE_CONFIG[BonificationRefusedType.QUOTIENT_FAMILY_TOO_HIGH].primaryButton.wording
      )
      await userEvent.press(button)

      expect(navigate).toHaveBeenCalledWith('TabNavigator', { params: undefined, screen: 'Home' })
    })
  })
})
