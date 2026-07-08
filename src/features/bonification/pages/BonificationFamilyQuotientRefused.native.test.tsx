import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { BonificationType } from 'features/bonification/enums'
import {
  BonificationFamilyQuotientRefused,
  PAGE_CONFIG,
} from 'features/bonification/pages/BonificationFamilyQuotientRefused'
import { BonificationQFRefusedType } from 'features/bonification/types/BonificationRefusedType'
import { beneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/auth/context/AuthContext')

describe('BonificationFamilyQuotientRefused', () => {
  beforeEach(() => setFeatureFlags([]))

  describe('Parent not found', () => {
    it('should go navigate to BonificationRequiredInformation when pressing "Renouveler ma demande" button', async () => {
      useRoute.mockReturnValueOnce({
        params: { bonificationRefusedType: BonificationQFRefusedType.CUSTODIAN_NOT_FOUND },
      })
      render(<BonificationFamilyQuotientRefused />)

      const button = screen.getByText(
        PAGE_CONFIG[BonificationQFRefusedType.CUSTODIAN_NOT_FOUND].primaryButton.wording
      )
      await userEvent.press(button)

      expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
        params: { bonificationType: BonificationType.FAMILY_QUOTIENT },
        screen: 'BonificationRequiredInformation',
      })
    })

    it('should show number of remaining retries if equal or under 5', async () => {
      useRoute.mockReturnValueOnce({
        params: { bonificationRefusedType: BonificationQFRefusedType.CUSTODIAN_NOT_FOUND },
      })
      mockAuthContextWithUser({ ...beneficiaryUser, remainingBonusAttempts: 5 })

      render(<BonificationFamilyQuotientRefused />)

      const remainingAttemptsText = screen.getByText('Attention, il te reste : 5 demandes')

      expect(remainingAttemptsText).toBeOnTheScreen()
    })

    it('should not show number of remaining retries if over 5', async () => {
      useRoute.mockReturnValueOnce({
        params: { bonificationRefusedType: BonificationQFRefusedType.APPLICATION_NOT_FOUND },
      })
      mockAuthContextWithUser({ ...beneficiaryUser, remainingBonusAttempts: 6 })

      render(<BonificationFamilyQuotientRefused />)

      const remainingAttemptsText = screen.queryByText('Attention, il te reste : 6 demandes')

      expect(remainingAttemptsText).not.toBeOnTheScreen()
    })
  })

  describe('Too many retries', () => {
    it('should go navigate to home when pressing "Revenir à l’accueil"', async () => {
      useRoute.mockReturnValueOnce({
        params: { bonificationRefusedType: BonificationQFRefusedType.TOO_MANY_RETRIES },
      })
      render(<BonificationFamilyQuotientRefused />)

      const button = screen.getByText(
        PAGE_CONFIG[BonificationQFRefusedType.TOO_MANY_RETRIES].primaryButton.wording
      )
      await userEvent.press(button)

      expect(navigate).toHaveBeenCalledWith('TabNavigator', { params: undefined, screen: 'Home' })
    })

    it('should not show number of remaining retries', async () => {
      useRoute.mockReturnValueOnce({
        params: { bonificationRefusedType: BonificationQFRefusedType.TOO_MANY_RETRIES },
      })
      mockAuthContextWithUser({ ...beneficiaryUser, remainingBonusAttempts: 0 })

      render(<BonificationFamilyQuotientRefused />)

      const remainingAttemptsText = screen.queryByText('Attention, il te reste : 0 demandes')

      expect(remainingAttemptsText).not.toBeOnTheScreen()
    })
  })

  describe('Child not found', () => {
    it('should go navigate to home when pressing "Renouveler ma demande"', async () => {
      useRoute.mockReturnValueOnce({
        params: { bonificationRefusedType: BonificationQFRefusedType.NOT_IN_TAX_HOUSEHOLD },
      })
      render(<BonificationFamilyQuotientRefused />)

      const button = screen.getByText(
        PAGE_CONFIG[BonificationQFRefusedType.NOT_IN_TAX_HOUSEHOLD].primaryButton.wording
      )
      await userEvent.press(button)

      expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
        params: { bonificationType: BonificationType.FAMILY_QUOTIENT },
        screen: 'BonificationRequiredInformation',
      })
    })

    it('should show number of remaining retries if equal or under 5', async () => {
      useRoute.mockReturnValueOnce({
        params: { bonificationRefusedType: BonificationQFRefusedType.NOT_IN_TAX_HOUSEHOLD },
      })
      mockAuthContextWithUser({ ...beneficiaryUser, remainingBonusAttempts: 5 })

      render(<BonificationFamilyQuotientRefused />)

      const remainingAttemptsText = screen.getByText('Attention, il te reste : 5 demandes')

      expect(remainingAttemptsText).toBeOnTheScreen()
    })

    it('should adapt singular when remaining retries is 1', async () => {
      useRoute.mockReturnValueOnce({
        params: { bonificationRefusedType: BonificationQFRefusedType.NOT_IN_TAX_HOUSEHOLD },
      })
      mockAuthContextWithUser({ ...beneficiaryUser, remainingBonusAttempts: 1 })

      render(<BonificationFamilyQuotientRefused />)

      const remainingAttemptsText = screen.getByText('Attention, il te reste : 1 demande')

      expect(remainingAttemptsText).toBeOnTheScreen()
    })

    it('should not show number of remaining retries if over 5', async () => {
      useRoute.mockReturnValueOnce({
        params: { bonificationRefusedType: BonificationQFRefusedType.NOT_IN_TAX_HOUSEHOLD },
      })
      mockAuthContextWithUser({ ...beneficiaryUser, remainingBonusAttempts: 6 })

      render(<BonificationFamilyQuotientRefused />)

      const remainingAttemptsText = screen.queryByText('Attention, il te reste : 6 demandes')

      expect(remainingAttemptsText).not.toBeOnTheScreen()
    })
  })

  describe('Family quotient too high', () => {
    it('should go navigate to home when pressing "Revenir vers le catalogue"', async () => {
      useRoute.mockReturnValueOnce({
        params: { bonificationRefusedType: BonificationQFRefusedType.QUOTIENT_FAMILY_TOO_HIGH },
      })
      render(<BonificationFamilyQuotientRefused />)

      const button = screen.getByText(
        PAGE_CONFIG[BonificationQFRefusedType.QUOTIENT_FAMILY_TOO_HIGH].primaryButton.wording
      )
      await userEvent.press(button)

      expect(navigate).toHaveBeenCalledWith('TabNavigator', { params: undefined, screen: 'Home' })
    })

    it('should not show number of remaining retries', async () => {
      useRoute.mockReturnValueOnce({
        params: { bonificationRefusedType: BonificationQFRefusedType.QUOTIENT_FAMILY_TOO_HIGH },
      })
      mockAuthContextWithUser({ ...beneficiaryUser, remainingBonusAttempts: 4 })

      render(<BonificationFamilyQuotientRefused />)

      const remainingAttemptsText = screen.queryByText('Attention, il te reste : 4 demandes')

      expect(remainingAttemptsText).not.toBeOnTheScreen()
    })
  })

  describe('when manual request is disabled', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.DISABLE_QF_BONIFICATION_MANUAL_REQUEST])
    })

    it('should disable button', () => {
      render(<BonificationFamilyQuotientRefused />)

      const button = screen.getByText(
        PAGE_CONFIG[BonificationQFRefusedType.NOT_IN_TAX_HOUSEHOLD].primaryButton.wording
      )

      expect(button).toBeDisabled()
    })

    it('should display unavailable message', () => {
      mockAuthContextWithUser({ ...beneficiaryUser, remainingBonusAttempts: 10 })

      render(<BonificationFamilyQuotientRefused />)

      expect(
        screen.getByText('La demande de bonus est temporairement indisponible')
      ).toBeOnTheScreen()
    })

    it('should show remaining retries instead of unavailable message when both are true', () => {
      mockAuthContextWithUser({ ...beneficiaryUser, remainingBonusAttempts: 3 })

      render(<BonificationFamilyQuotientRefused />)

      expect(screen.getByText('Attention, il te reste : 3 demandes')).toBeOnTheScreen()
      expect(
        screen.queryByText('La demande de bonus est temporairement indisponible')
      ).not.toBeOnTheScreen()
    })
  })
})
