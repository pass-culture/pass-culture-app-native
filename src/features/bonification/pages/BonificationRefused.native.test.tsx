import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import {
  BonificationRefused,
  BonificationRefusedType,
  PAGE_CONFIG,
} from 'features/bonification/pages/BonificationRefused'
import { beneficiaryUser } from 'fixtures/user'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/auth/context/AuthContext')

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
        screen: 'BonificationRequiredInformation',
      })
    })

    it('should show number of remaining retries if equal or under 5', async () => {
      useRoute.mockReturnValueOnce({
        params: { bonificationRefusedType: BonificationRefusedType.CUSTODIAN_NOT_FOUND },
      })
      mockAuthContextWithUser({ ...beneficiaryUser, remainingBonusAttempts: 5 })

      render(<BonificationRefused />)

      const remainingAttemptsText = screen.getByText('Attention, il te reste : 5 demandes')

      expect(remainingAttemptsText).toBeOnTheScreen()
    })

    it('should not show number of remaining retries if over 5', async () => {
      useRoute.mockReturnValueOnce({
        params: { bonificationRefusedType: BonificationRefusedType.CUSTODIAN_NOT_FOUND },
      })
      mockAuthContextWithUser({ ...beneficiaryUser, remainingBonusAttempts: 6 })

      render(<BonificationRefused />)

      const remainingAttemptsText = screen.queryByText('Attention, il te reste : 6 demandes')

      expect(remainingAttemptsText).not.toBeOnTheScreen()
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

    it('should not show number of remaining retries', async () => {
      useRoute.mockReturnValueOnce({
        params: { bonificationRefusedType: BonificationRefusedType.TOO_MANY_RETRIES },
      })
      mockAuthContextWithUser({ ...beneficiaryUser, remainingBonusAttempts: 0 })

      render(<BonificationRefused />)

      const remainingAttemptsText = screen.queryByText('Attention, il te reste : 0 demandes')

      expect(remainingAttemptsText).not.toBeOnTheScreen()
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
        screen: 'BonificationRequiredInformation',
      })
    })

    it('should show number of remaining retries if equal or under 5', async () => {
      useRoute.mockReturnValueOnce({
        params: { bonificationRefusedType: BonificationRefusedType.NOT_IN_TAX_HOUSEHOLD },
      })
      mockAuthContextWithUser({ ...beneficiaryUser, remainingBonusAttempts: 5 })

      render(<BonificationRefused />)

      const remainingAttemptsText = screen.getByText('Attention, il te reste : 5 demandes')

      expect(remainingAttemptsText).toBeOnTheScreen()
    })

    it('should adapt singular when remaining retries is 1', async () => {
      useRoute.mockReturnValueOnce({
        params: { bonificationRefusedType: BonificationRefusedType.NOT_IN_TAX_HOUSEHOLD },
      })
      mockAuthContextWithUser({ ...beneficiaryUser, remainingBonusAttempts: 1 })

      render(<BonificationRefused />)

      const remainingAttemptsText = screen.getByText('Attention, il te reste : 1 demande')

      expect(remainingAttemptsText).toBeOnTheScreen()
    })

    it('should not show number of remaining retries if over 5', async () => {
      useRoute.mockReturnValueOnce({
        params: { bonificationRefusedType: BonificationRefusedType.NOT_IN_TAX_HOUSEHOLD },
      })
      mockAuthContextWithUser({ ...beneficiaryUser, remainingBonusAttempts: 6 })

      render(<BonificationRefused />)

      const remainingAttemptsText = screen.queryByText('Attention, il te reste : 6 demandes')

      expect(remainingAttemptsText).not.toBeOnTheScreen()
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

    it('should not show number of remaining retries', async () => {
      useRoute.mockReturnValueOnce({
        params: { bonificationRefusedType: BonificationRefusedType.QUOTIENT_FAMILY_TOO_HIGH },
      })
      mockAuthContextWithUser({ ...beneficiaryUser, remainingBonusAttempts: 4 })

      render(<BonificationRefused />)

      const remainingAttemptsText = screen.queryByText('Attention, il te reste : 4 demandes')

      expect(remainingAttemptsText).not.toBeOnTheScreen()
    })
  })
})
